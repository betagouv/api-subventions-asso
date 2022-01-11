export interface SiretDataInterface {
    etablissement: {
        siret: string,
        unite_legale: {
            identifiant_association: string,
            categorie_juridique: string
        }
    }
}