import { Rna, Siret } from "../../../@types";

export interface SiretDataInterface {
    etablissement: {
        siret: Siret,
        unite_legale: {
            identifiant_association: Rna,
            categorie_juridique: string
        }
    }
}