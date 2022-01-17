import entrepriseApiService from "../../modules/external/entreprise-api.service";
import searchService from "../../modules/search/search.service";
import { LEGAL_CATEGORIES_ACCEPTED } from "../LegalCategoriesAccepted";

export const ERRORS_CODES = {
    RNA_NOT_FOUND: 11,
    ILLEGAL_CATEGORY: 10
}

export async function findRnaBySiret(siret: string, wait = false) {
    // - 1 Search in local Db
    const requests = await searchService.findRequestsBySiret(siret);
    if (requests.length) return requests[0].legalInformations.rna;

    // - 2 If Rna not found search in siret api and check type of compagny
    const siretData = await entrepriseApiService.findSiretDataBySiret(siret, wait);
    if (siretData) {
        if (siretData.etablissement.unite_legale.identifiant_association) {
            return siretData.etablissement.unite_legale.identifiant_association;
        } else if (!LEGAL_CATEGORIES_ACCEPTED.includes(siretData.etablissement.unite_legale.categorie_juridique)) { // Check if company is an association
            return {
                state: "rejected",
                code: ERRORS_CODES.ILLEGAL_CATEGORY,
            }
        }
    }

    // - 3 If Rna not found search in rna api
    const rnaData = await entrepriseApiService.findRnaDataBySiret(siret, wait);
    if (rnaData && rnaData.association.id_association) {
        return rnaData.association.id_association;
    }

    return {
        state: "rejected",
        code: ERRORS_CODES.RNA_NOT_FOUND,
    }
}