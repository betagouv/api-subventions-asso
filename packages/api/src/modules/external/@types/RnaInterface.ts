import { Rna, Siret } from "../../../@types";

export default interface RnaInterface {
    association: {
        siret: null | Siret,
        id_association: Rna
    }
}