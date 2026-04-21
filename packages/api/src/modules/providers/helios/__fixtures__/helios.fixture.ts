import ALLOCATORS from "../../../../../tests/__fixtures__/allocators.fixture";
import DEFAULT_ASSOCIATION from "../../../../../tests/__fixtures__/association.fixture";
import HeliosEntity from "../domain/helios.entity";

export const HELIOS_ENTITY: HeliosEntity = {
    codeDep: "49",
    codeInseeBc: ALLOCATORS[0].siret,
    collec: "COLLECTIVITE NAME",
    compteNature: 65748,
    dateEmission: new Date("2025-06-10"),
    datePaiement: new Date("2025-06-11"),
    id: "5670111202501526",
    immatriculation: DEFAULT_ASSOCIATION.siret,
    montantPaiment: 105,
    natureJuridique: "6-Association",
    nom: "APE ECOLE PUBLIQUE",
    nomenclature: "73-M57",
    numMandat: 526,
    numeroLigne: 1,
    objectMandat: "ATTRIBUTION SUBVENTION APE",
    typeBudgetCollectivite: "Commune",
    typeImmatriculation: "SIRET",
    typeMandat: "1-Mandat(s) ordinaire(s)",
    updateDate: new Date("2026-04-10"),
};
