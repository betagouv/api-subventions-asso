import PaymentFlatEntity from "../../../../entities/PaymentFlatEntity";
import Siren from "../../../../valueObjects/Siren";
import Siret from "../../../../valueObjects/Siret";

export const PAYMENT_FLAT_ENTITY = new PaymentFlatEntity(
    new Siret("12345678901234"), // siret
    new Siren("123456789"), // siren
    1000, // operation amount
    new Date("2023-04-01"), // operation date
    "Programme Exemple", // program
    1, // program number
    "Mission Exemple", // mission
    "Ministère Exemple", // ministry
    "ME", // ministry acronym
    "EJ Exemple", // EJ
    "Fournisseur Exemple", // provider
    "AC123", // action code
    "Label d'action Exemple", // action label
    "AC456", // acitivity code
    "Label d'activité Exemple", // activity label
);

export const PAYMENT_FLAT_ENTITY_WITH_NULLS = new PaymentFlatEntity(
    new Siret("12345678901234"), // siret
    new Siren("123456789"), // siren
    1000, // operation amount
    new Date("2023-04-01"), // operation date
    null, // program
    1, // program number
    "Mission Exemple", // mission
    "Ministère Exemple", // ministry
    null, // ministry acronym
    "EJ Exemple", // EJ
    "Fournisseur Exemple", // provider
    "AC123", // action code
    "Label d'action Exemple", // action label
    "AC456", // acitivity code
    "Label d'activité Exemple", // activity label
);
