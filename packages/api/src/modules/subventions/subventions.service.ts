import { Siret } from "dto";
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum";
import { siretToSiren } from "../../shared/helpers/SirenHelper";
import { capitalizeFirstLetter } from "../../shared/helpers/StringHelper";
import { getIdentifierType } from "../../shared/helpers/IdentifierHelper";
import { AssociationIdentifiers, StructureIdentifiers } from "../../@types";
import providers from "../providers";
import Flux from "../../shared/Flux";
import StructureIdentifiersError from "../../shared/errors/StructureIdentifierError";
import AssociationIdentifierError from "../../shared/errors/AssociationIdentifierError";
import rnaSirenService from "../rna-siren/rnaSiren.service";
import DemandesSubventionsProvider from "./@types/DemandesSubventionsProvider";
import { SubventionsFlux } from "./@types/SubventionsFlux";

export class SubventionsService {
    async getDemandesByAssociation(id: AssociationIdentifiers) {
        let type = getIdentifierType(id);
        if (!type) throw new AssociationIdentifierError();

        if (type === StructureIdentifiersEnum.rna) {
            const rnaSirenEntities = await rnaSirenService.find(id);
            if (rnaSirenEntities && rnaSirenEntities.length) {
                id = rnaSirenEntities[0].siren;
                type = StructureIdentifiersEnum.siren;
            }
        }

        return this.aggregate(id, type);
    }

    getDemandesByEtablissement(id: Siret) {
        const type = getIdentifierType(id);
        if (type !== StructureIdentifiersEnum.siret) throw new StructureIdentifiersError("SIRET");

        return this.aggregateByType(id, StructureIdentifiersEnum.siret);
    }

    private aggregate(
        id: StructureIdentifiers,
        type: Record<StructureIdentifiersEnum, string>[StructureIdentifiersEnum],
    ): Flux<SubventionsFlux> {
        if (type === StructureIdentifiersEnum.siret || type === StructureIdentifiersEnum.siren) {
            if (type === StructureIdentifiersEnum.siret) id = siretToSiren(id);
            return this.aggregateByType(id, StructureIdentifiersEnum.siren);
        } else {
            return this.aggregateByType(id, StructureIdentifiersEnum.rna);
        }
    }

    private aggregateByType(id: StructureIdentifiers, type: StructureIdentifiersEnum): Flux<SubventionsFlux> {
        const functionName = `getDemandeSubventionBy${capitalizeFirstLetter(type)}` as
            | "getDemandeSubventionBySiret"
            | "getDemandeSubventionBySiren";
        const subventionsFlux = new Flux<SubventionsFlux>();
        const providers = this.getDemandesSubventionsProviders();

        const defaultMeta = {
            totalProviders: providers.length,
        };

        subventionsFlux.push({
            __meta__: defaultMeta,
        });

        let countAnswers = 0;

        providers.forEach(p =>
            p[functionName](id).then(subventions => {
                countAnswers++;

                subventionsFlux.push({
                    __meta__: { ...defaultMeta, provider: p.provider.name },
                    subventions: subventions || [],
                });

                if (countAnswers === providers.length) subventionsFlux.close();
            }),
        );

        return subventionsFlux;
    }

    private getDemandesSubventionsProviders() {
        return Object.values(providers).filter(
            p => (p as unknown as DemandesSubventionsProvider).isDemandesSubventionsProvider,
        ) as unknown as DemandesSubventionsProvider[];
    }
}

const subventionsService = new SubventionsService();

export default subventionsService;
