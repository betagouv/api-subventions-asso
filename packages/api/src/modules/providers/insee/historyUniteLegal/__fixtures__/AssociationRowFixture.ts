import { LEGAL_CATEGORIES_ACCEPTED } from "../../../../../shared/LegalCategoriesAccepted";
import { UniteLegalHistoryRow } from "../@types/UniteLegalHistoryRow";

export const AssociationRow = {
    siren: "000000001",
    denominationUniteLegale: "DENOMINATION",
    categorieJuridiqueUniteLegale: Number(LEGAL_CATEGORIES_ACCEPTED[0]),
    dateDebut: new Date().toISOString(),
} as UniteLegalHistoryRow;
