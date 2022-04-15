import { AssociationIdentifiers, StructureIdentifiers } from '../../@types';
import { isRna, isSiren, isSiret } from '../../shared/Validators';
import providers from "../providers";
import DemandesSubventionsProvider from "./@types/DemandesSubventionsProvider";
import DemandeSubvention from "./@types/DemandeSubvention";
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum"
import { siretToSiren } from '../../shared/helpers/SirenHelper';
import { capitalizeFirstLetter } from '../../shared/helpers/StringHelper'
import { Siret } from '@api-subventions-asso/dto';

export class DemandesSubventionsService {

    async getByAssociation(id: AssociationIdentifiers) {
        const type = this.getIdentifierType(id) ;
        if (!type) throw new Error("You must provide a valid SIREN or RNA");
        const data = await (await this.aggregate(id, type))?.filter(asso => asso) as DemandeSubvention[];
        if (!data.length) throw  new Error("Association not found");
        return data;
    }
    
    async getByEtablissement(id: Siret) {
        const data = await (await this.aggregateByType(id, StructureIdentifiersEnum.siret))?.filter(asso => asso) as DemandeSubvention[];
        if(!data.length)  if (!data.length) throw  new Error("Establishment not found");
        return data;
    }
    
    private getIdentifierType(id: StructureIdentifiers): string | null {
        if (isRna(id)) return StructureIdentifiersEnum.rna;
        if (isSiren(id)) return StructureIdentifiersEnum.siren;
        if(isSiret(id)) return StructureIdentifiersEnum.siret
        else return null;
    }
    
    private async aggregate(id: StructureIdentifiers, type: Record<StructureIdentifiersEnum, string>[StructureIdentifiersEnum]) {
        let subventions;
        if (type === StructureIdentifiersEnum.siret || type === StructureIdentifiersEnum.siren) {
            if (type === StructureIdentifiersEnum.siret) id = siretToSiren(id);
            subventions = await this.aggregateByType(id, StructureIdentifiersEnum.siren)
            if (subventions.length > 0) return subventions;
        }
        else {
            subventions = await this.aggregateByType(id, StructureIdentifiersEnum.rna)
            return subventions;
        }
    }
    
    private async aggregateByType(id: StructureIdentifiers, type: StructureIdentifiersEnum) {
        return [...(await Promise.all(
            this.getDemandesSubventionsProviders().map(p => { 
                console.log({p});
                return p[`getDemandeSubventionBy${capitalizeFirstLetter(type)}` as "getDemandeSubventionBySiret" | "getDemandeSubventionBySiren" | "getDemandeSubventionByRna"](id) })
        )).flat()];
    }

    private getDemandesSubventionsProviders() {
        return Object.values(providers).filter((p) => (p as unknown as DemandesSubventionsProvider).isDemandesSubventionsProvider) as unknown as DemandesSubventionsProvider[];
    }
}

const demandesSubventionsService = new DemandesSubventionsService();

export default demandesSubventionsService;