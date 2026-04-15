import ALLOCATORS from "../../../../../../../tests/__fixtures__/allocators.fixture";
import DEFAULT_ASSOCIATION from "../../../../../../../tests/__fixtures__/association.fixture";
import HeliosDto from "../../../../../inputs/cli/helios/helios.dto";

export const HELIOS_DTO: HeliosDto = {
    CODE_DEPARTEMENT: "'35",
    CODE_INSEE_BC: ALLOCATORS[0].siret,
    COLLEC: "COLLECTIVITY NAME",
    COMPTE_NATURE: 65748,
    DATE_EMISSION: "10/05/2025",
    DATE_PAIEMENT: "24/07/2025",
    ID: "12345678901234",
    IMMATRICULATION: DEFAULT_ASSOCIATION.siret,
    MONTANT_PAIEMENT: 2400,
    NOM: "NOM ASSO 1",
    NOMENCLATURE: "73-M57",
    NUMERO_LIGNE: 12,
    NUM_MANDAT: 740,
    "Nature JURIDIQUE": "6-Association",
    OBJET_MANDAT: "SUBVENTION ANNEE 2025",
    "TYPE MANDAT": "1-Mandat(s) ordinaire(s)",
    TYPE_BUDGET_COLLECTIVITE: "Commune",
    TYPE_IMMATRICULATION: "SIRET",
};
