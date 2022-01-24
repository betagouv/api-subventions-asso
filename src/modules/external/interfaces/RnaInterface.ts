import { Rna } from "../../../@types/Rna";
import { Siret } from "../../../@types/Siret";

export default interface RnaInterface {
    association: {
        siret: null | Siret,
        id_association: Rna
    }
}