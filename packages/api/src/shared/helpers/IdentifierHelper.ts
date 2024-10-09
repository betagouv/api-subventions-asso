import { StructureIdentifiers } from "dto";
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum";
import { isRna, isSiren, isSiret } from "../Validators";

export const getIdentifierType = (id: StructureIdentifiers) => {
    if (isRna(id)) return StructureIdentifiersEnum.rna;
    if (isSiren(id)) return StructureIdentifiersEnum.siren;
    if (isSiret(id)) return StructureIdentifiersEnum.siret;
    else return null;
};
