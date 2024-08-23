import PaymentFlatEntity from "../../../../entities/PaymentFlatEntity";
import Siren from "../../../../valueObjects/Siren";
import Siret from "../../../../valueObjects/Siret";

export const PAYMENT_FLAT_ENTITY = new PaymentFlatEntity(
    new Siret("12345678901234"), // siret
    new Siren("123456789"), // siren
    1000, // operation amount
    new Date("2023-04-01"), // operation date
    "Programme Exemple", // program
    163, // program number
    "Mission Exemple", // mission
    "Ministère Exemple", // ministry
    "ME", // ministry acronym
    "EJ Exemple", // EJ
    "chorus", // provider
    "0163AC123", // action code
    "Label d'action Exemple", // action label
    "AC4560000000", // acitivity code
    "Label d'activité Exemple", // activity label
);
