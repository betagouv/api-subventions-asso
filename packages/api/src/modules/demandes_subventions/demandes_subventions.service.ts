import { AssociationIdentifiers, StructureIdentifiers } from '../../@types';
import { getIdentifierType } from "../../shared/helpers/IdentifierHelper"
import DemandesSubventionsProvider from "./@types/DemandesSubventionsProvider";
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum"
import { siretToSiren } from '../../shared/helpers/SirenHelper';
import { capitalizeFirstLetter } from '../../shared/helpers/StringHelper'
import { Siret } from "api-subventions-asso-dto";
import DemandeSubvention from "api-subventions-asso-dto/search/DemandeSubventionDto";
import providers from "../providers";

export class DemandesSubventionsService {

    async getByAssociation(id: AssociationIdentifiers) {
        const type = getIdentifierType(id) ;
        if (!type) throw new Error("You must provide a valid SIREN or RNA");
        const data = (await this.aggregate(id, type))?.filter(asso => asso);
        if (!data.length) throw new Error("Association not found");
        return data;
    }
    
    async getByEtablissement(id: Siret) {
        const data = await (await this.aggregateByType(id, StructureIdentifiersEnum.siret))?.filter(asso => asso) as DemandeSubvention[];
        if(!data.length) throw new Error("Establishment not found");
        return data;
    }
    
    private async aggregate(id: StructureIdentifiers, type: Record<StructureIdentifiersEnum, string>[StructureIdentifiersEnum]): Promise<DemandeSubvention[]> {
        let subventions;
        if (type === StructureIdentifiersEnum.siret || type === StructureIdentifiersEnum.siren) {
            if (type === StructureIdentifiersEnum.siret) id = siretToSiren(id);
            subventions = await this.aggregateByType(id, StructureIdentifiersEnum.siren)
            if (subventions.length > 0) return subventions;
        }
        else {
            subventions = await this.aggregateByType(id, StructureIdentifiersEnum.rna)
        }
        return subventions;
    }
    
    private async aggregateByType(id: StructureIdentifiers, type: StructureIdentifiersEnum): Promise<DemandeSubvention[]> {
        const promises = this.getDemandesSubventionsProviders().map(p => p[`getDemandeSubventionBy${capitalizeFirstLetter(type)}` as "getDemandeSubventionBySiret" | "getDemandeSubventionBySiren" | "getDemandeSubventionByRna"](id));
        return [...(await Promise.all(promises)).flat()] as DemandeSubvention[];
    }

    private getDemandesSubventionsProviders() {
        return Object.values(providers).filter((p) => (p as DemandesSubventionsProvider).isDemandesSubventionsProvider) as unknown as DemandesSubventionsProvider[];
    }
}

const demandesSubventionsService = new DemandesSubventionsService();

export default demandesSubventionsService;