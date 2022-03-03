import { Rna } from "../../../@types/Rna";
import { Siret } from "../../../@types/Siret";

export interface SiretDataInterface {
    etablissement: {
        siret: Siret,
        unite_legale: {
            identifiant_association: Rna,
            categorie_juridique: string
        }
    }
}