import { LEGAL_CATEGORIES_ACCEPTED } from "../../../../shared/LegalCategoriesAccepted";
import { UniteLegalHistoryRaw } from "../@types/UniteLegalHistoryRaw";

export const AssociationRaw = {
    siren: "000000001",
    denominationUniteLegale: "DENOMINATION",
    categorieJuridiqueUniteLegale: Number(LEGAL_CATEGORIES_ACCEPTED[0]),
    dateDebut: new Date().toISOString()
} as UniteLegalHistoryRaw;
