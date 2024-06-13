import { Siren, Siret } from "dto";
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
    public providers = this.getDemandesSubventionsProviders();
    public getBySirenMethod = "getDemandeSubventionBySiren";
    public getBySiretMethod = "getDemandeSubventionBySiret";

    private getDemandesSubventionsProviders() {
        return Object.values(providers).filter(
            p => (p as DemandesSubventionsProvider<unknown>).isDemandesSubventionsProvider,
        ) as DemandesSubventionsProvider<unknown>[];
    }

    async getDemandesByAssociation(identifier: AssociationIdentifiers) {
        const type = getIdentifierType(identifier);
        if (!type) throw new AssociationIdentifierError();
        if (type === StructureIdentifiersEnum.rna) {
            const rnaSirenEntities = await rnaSirenService.find(identifier);
            if (rnaSirenEntities && rnaSirenEntities.length) {
                return this.getApplicationFetcher(this.getBySirenMethod)(rnaSirenEntities[0].siren);
            } else return null;
        } else {
            if (type === StructureIdentifiersEnum.siret)
                return this.getApplicationFetcher(this.getBySiretMethod)(identifier);
            return this.getApplicationFetcher(this.getBySirenMethod)(identifier);
        }
    }

    getDemandesByEtablissement(siret: Siret) {
        const type = getIdentifierType(siret);
        if (type !== StructureIdentifiersEnum.siret)
            throw new StructureIdentifiersError(StructureIdentifiersEnum.siret);
        return this.getApplicationFetcher(this.getBySiretMethod)(siret);
    }

    getApplicationFetcher(fn) {
        const subventionsFlux = new Flux<SubventionsFlux>();
        const defaultMeta = {
            totalProviders: this.providers.length,
        };

        subventionsFlux.push({
            __meta__: defaultMeta,
        });

        let countAnswers = 0;

        return identifier => {
            this.providers.forEach(p =>
                p[fn](identifier).then(subventions => {
                    countAnswers++;

                    subventionsFlux.push({
                        __meta__: { ...defaultMeta, provider: p.provider.name },
                        subventions: subventions || [],
                    });

                    if (countAnswers === this.providers.length) subventionsFlux.close();
                }),
            );
            return subventionsFlux;
        };
    }
}

const subventionsService = new SubventionsService();

export default subventionsService;
