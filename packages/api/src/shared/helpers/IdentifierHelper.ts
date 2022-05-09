import { StructureIdentifiersEnum } from '../../@enums/StructureIdentifiersEnum';
import { StructureIdentifiers } from '../../@types';
import { isRna, isSiren, isSiret } from '../Validators';


export default {
    getIdentifierType: (id: StructureIdentifiers): string | null => {
        if (isRna(id)) return StructureIdentifiersEnum.rna;
        if (isSiren(id)) return StructureIdentifiersEnum.siren
        if (isSiret(id)) return StructureIdentifiersEnum.siret
        else return null;
    } 
}