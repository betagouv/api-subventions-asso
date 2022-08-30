import { AssociationIdentifiers, StructureIdentifiers } from '../../@types';
import { getIdentifierType } from "../../shared/helpers/IdentifierHelper"
import DemandesSubventionsProvider from "./@types/DemandesSubventionsProvider";
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum"
import { siretToSiren } from '../../shared/helpers/SirenHelper';
import { capitalizeFirstLetter } from '../../shared/helpers/StringHelper'
import { Siret, DemandeSubvention } from "@api-subventions-asso/dto";
import providers from "../providers";
import rnaSirenService from '../open-data/rna-siren/rnaSiren.service';
import { SubventionsFlux } from './@types/SubventionsFlux';
import Flux from '../../shared/Flux';

export class SubventionsService {
    async getDemandesByAssociation(id: AssociationIdentifiers) {
        let type = getIdentifierType(id);
        if (!type) throw new Error("You must provide a valid SIREN or RNA");

        if (type === StructureIdentifiersEnum.rna) {
            const siren = await rnaSirenService.getSiren(id);
            if (siren) {
                id = siren;
                type = StructureIdentifiersEnum.siren;
            }
        }

        return this.aggregate(id, type);
    }

    async getDemandesByEtablissement(id: Siret) {
        const type = getIdentifierType(id);
        if (type !== StructureIdentifiersEnum.siret) throw new Error("You must provide a valid SIRET");

        const data = await this.aggregateByType(id, StructureIdentifiersEnum.siret).toPromise()
        const subventions = data.map(subFlux => subFlux.subventions).flat();

        if (!subventions.length) throw new Error("Establishment not found");
        return subventions.filter(subvention => subvention) as DemandeSubvention[];
    }

    async getDemandeById(id: string) {
        const rejectIfNull = (demande: DemandeSubvention) => demande ? demande : Promise.reject();
        const providers = this.getDemandesSubventionsProviders();
        const promises = providers.map(p => p.getDemandeSubventionById(id).then(rejectIfNull));
        return await Promise.any(promises).catch(() => null);
    }

    private aggregate(id: StructureIdentifiers, type: Record<StructureIdentifiersEnum, string>[StructureIdentifiersEnum]): Flux<SubventionsFlux> {
        if (type === StructureIdentifiersEnum.siret || type === StructureIdentifiersEnum.siren) {
            if (type === StructureIdentifiersEnum.siret) id = siretToSiren(id);
            return this.aggregateByType(id, StructureIdentifiersEnum.siren);
        }
        else {
            return this.aggregateByType(id, StructureIdentifiersEnum.rna);
        }
    }

    private aggregateByType(id: StructureIdentifiers, type: StructureIdentifiersEnum): Flux<SubventionsFlux> {
        const functionName = `getDemandeSubventionBy${capitalizeFirstLetter(type)}` as "getDemandeSubventionBySiret" | "getDemandeSubventionBySiren" | "getDemandeSubventionByRna";
        const subventionsFlux = new Flux<SubventionsFlux>();
        const providers = this.getDemandesSubventionsProviders();

        const defaultMeta = {
            totalProviders: providers.length
        }

        subventionsFlux.push({
            __meta__: defaultMeta
        })

        let countAnswers = 0;

        providers.forEach(p => p[functionName](id).then(subventions => {
            countAnswers++;

            subventionsFlux.push({
                __meta__: { ...defaultMeta, provider: p.provider.name },
                subventions: subventions || [],
            });

            if (countAnswers === providers.length) subventionsFlux.close();
        }));

        return subventionsFlux;
    }

    private getDemandesSubventionsProviders() {
        return Object.values(providers).filter((p) => (p as unknown as DemandesSubventionsProvider).isDemandesSubventionsProvider) as unknown as DemandesSubventionsProvider[];
    }
}

const subventionsService = new SubventionsService();

export default subventionsService;