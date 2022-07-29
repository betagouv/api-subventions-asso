import { AssociationIdentifiers, StructureIdentifiers } from '../../@types';
import { getIdentifierType } from "../../shared/helpers/IdentifierHelper"
import DemandesSubventionsProvider from "./@types/DemandesSubventionsProvider";
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum"
import { siretToSiren } from '../../shared/helpers/SirenHelper';
import { capitalizeFirstLetter } from '../../shared/helpers/StringHelper'
import { Siret , DemandeSubvention } from "@api-subventions-asso/dto";
import providers from "../providers";
import rnaSirenService from '../open-data/rna-siren/rnaSiren.service';
import { SubventionsFlux } from './@types/SubventionsFlux';
import Flux from '../../shared/Flux';

export class SubventionsService {
    async getSubventionsFluxByAssociation(id: AssociationIdentifiers) {
        const subventionsFlux = new Flux<SubventionsFlux>();
        let type = getIdentifierType(id) ;
        if (!type) throw new Error("You must provide a valid SIREN or RNA");

        if (type === StructureIdentifiersEnum.rna) {
            const siren = await rnaSirenService.getSiren(id);
            if (siren) {
                id = siren;
                type = StructureIdentifiersEnum.siren;
            }
        }

        this.aggregate(id, type, subventionsFlux);

        return subventionsFlux;
    }

    async getDemandesByAssociation(id: AssociationIdentifiers) {
        let type = getIdentifierType(id) ;
        if (!type) throw new Error("You must provide a valid SIREN or RNA");

        if (type === StructureIdentifiersEnum.rna) {
            const siren = await rnaSirenService.getSiren(id);
            if (siren) {
                id = siren;
                type = StructureIdentifiersEnum.siren;
            }
        }

        const data = (await this.aggregate(id, type))?.filter(asso => asso);
        if (!data.length) throw new Error("Association not found");
        return data;
    }
    
    async getDemandesByEtablissement(id: Siret) {
        const type = getIdentifierType(id);
        if (type !== StructureIdentifiersEnum.siret) throw new Error("You must provide a valid SIRET");
        const data = await (await this.aggregateByType(id, StructureIdentifiersEnum.siret))?.filter(asso => asso) as DemandeSubvention[];
        if(!data.length) throw new Error("Establishment not found");
        return data;
    }

    async getDemandeById(id: string) {
        const rejectIfNull = (demande: DemandeSubvention) => demande ? demande : Promise.reject();
        const providers = this.getDemandesSubventionsProviders();
        const promises = providers.map(p => p.getDemandeSubventionById(id).then(rejectIfNull));
        return await Promise.any(promises).catch(() => null);
    }
    
    private async aggregate(id: StructureIdentifiers, type: Record<StructureIdentifiersEnum, string>[StructureIdentifiersEnum], flux ?: Flux<SubventionsFlux>): Promise<DemandeSubvention[]> {
        let subventions;
        if (type === StructureIdentifiersEnum.siret || type === StructureIdentifiersEnum.siren) {
            if (type === StructureIdentifiersEnum.siret) id = siretToSiren(id);
            subventions = await this.aggregateByType(id, StructureIdentifiersEnum.siren, flux);
            if (subventions.length > 0) return subventions;
        }
        else {
            subventions = await this.aggregateByType(id, StructureIdentifiersEnum.rna, flux);
        }
        return subventions;
    }
    
    private async aggregateByType(id: StructureIdentifiers, type: StructureIdentifiersEnum, flux ?: Flux<SubventionsFlux>): Promise<DemandeSubvention[]> {
        const functionName = `getDemandeSubventionBy${capitalizeFirstLetter(type)}` as "getDemandeSubventionBySiret" | "getDemandeSubventionBySiren" | "getDemandeSubventionByRna";
        const promises = this.getDemandesSubventionsProviders().map(p =>  p[functionName](id));
        if (flux) {
            let countProvider = 0;
            promises.forEach(p => p.then(sub => {
                countProvider++;

                if (sub) flux.push({
                    count: countProvider,
                    totalProvider: promises.length,
                    subventions: sub,
                });
                return sub;
            }));
        }

        const result = [...(await Promise.all(promises)).flat()] as DemandeSubvention[];

        if (flux) flux.close();

        return result;
    }

    private getDemandesSubventionsProviders() {
        return Object.values(providers).filter((p) => (p as unknown as DemandesSubventionsProvider).isDemandesSubventionsProvider) as unknown as DemandesSubventionsProvider[];
    }
}

const subventionsService = new SubventionsService();

export default subventionsService;