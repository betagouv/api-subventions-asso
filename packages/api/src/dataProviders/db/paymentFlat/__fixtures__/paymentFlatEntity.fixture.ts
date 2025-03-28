import PaymentFlatEntity from "../../../../entities/PaymentFlatEntity";
import Siren from "../../../../valueObjects/Siren";
import Siret from "../../../../valueObjects/Siret";

export const PAYMENT_FLAT_ENTITY = new PaymentFlatEntity(
    2023, // exerciceBudgetaire
    "siret", // typeIdEtablissementBeneficiaire
    new Siret("12345678901234"), // siret
    "siren", // typeIdEntrepriseBeneficiaire
    new Siren("123456789"), // siren
    1000, // operation amount
    new Date("2023-04-01"), // operation date
    "AA01/0776-C001-4000", // centre financier code
    "UO DGER XXXX-C001", // centre financier libelle
    "BRET", // attachement comptable
    "EJ Exemple", // EJ
    "Fournisseur Exemple", // provider
    "Programme Exemple", // program
    1, // program number
    "Mission Exemple", // mission
    "Ministère Exemple", // ministry
    "ME", // ministry acronym
    "AC123", // action code
    "Label d'action Exemple", // action label
    "AC456", // acitivity code
    "Label d'activité Exemple", // activity label
);

export const PAYMENT_FLAT_ENTITY_WITH_NULLS = new PaymentFlatEntity(
    2023, // exerciceBudgetaire
    "siret", // typeIdEtablissementBeneficiaire
    new Siret("12345678901234"), // idEtablissementBeneficiaire
    "siren", // typeIdEntrepriseBeneficiaire
    new Siren("123456789"), // idEntrepriseBeneficiaire
    1000, // operation amount
    new Date("2023-04-01"), // operation date
    "AA01/0776-C001-4000", // centre financier code
    "UO DGER XXXX-C001", // centre financier libelle
    "BRET", // attachement comptable
    "EJ Exemple", // EJ
    "Fournisseur Exemple", // provider
    null, // program
    1, // program number
    "Mission Exemple", // mission
    "Ministère Exemple", // ministry
    null, // ministry acronym
    "AC123", // action code
    "Label d'action Exemple", // action label
    "AC456", // acitivity code
    "Label d'activité Exemple", // activity label
);
