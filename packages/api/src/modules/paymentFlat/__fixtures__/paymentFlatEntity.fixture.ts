import DEFAULT_ASSOCIATION from "../../../../tests/__fixtures__/association.fixture";
import PaymentFlatEntity from "../../../entities/PaymentFlatEntity";
import Siren from "../../../valueObjects/Siren";
import Siret from "../../../valueObjects/Siret";

export const PAYMENT_FLAT_ENTITY = new PaymentFlatEntity(
    `${DEFAULT_ASSOCIATION.siret}-0001821732-2023-101-0101-01-02-3222-1689120000000`, // uniqueId
    `${DEFAULT_ASSOCIATION.siret}-0001821732-2023`, // idVersement
    2023, // exerciceBudgetaire
    new Siret(DEFAULT_ASSOCIATION.siret), // siret
    new Siren(DEFAULT_ASSOCIATION.siren), // siren
    89988.3, // operation amount
    new Date("2023-07-12T00:00:00.000Z"), // operation date
    "Programme Exemple", // program
    101, // program number
    "Mission Exemple", // mission
    "Ministère Exemple", // ministry
    "ME", // ministry acronym
    "0001821732", // EJ
    "chorus", // provider
    "0101-01-02", // action code
    "Label d'action Exemple", // action label
    "3222", // acitivity code
    "Label d'activité Exemple", // activity label
);
