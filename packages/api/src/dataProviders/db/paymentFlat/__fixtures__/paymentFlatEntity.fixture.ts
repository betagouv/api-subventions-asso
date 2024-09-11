import PaymentFlatEntity from "../../../../entities/PaymentFlatEntity";

export const PAYMENT_FLAT_ENTITY = {
    uniqueId: "12345678901234", // uniqueId
    siret: "12345678901234", // siret
    siren: "123456789", // siren
    amount: 1000, // operation amount
    operationDate: new Date("2023-04-01"), // operation date
    programName: "Programme Exemple", // program
    programNumber: 1, // program number
    mission: "Mission Exemple", // mission
    ministry: "Ministère Exemple", // ministry
    ministryAcronym: "ME", // ministry acronym
    ej: "EJ Exemple", // EJ
    provider: "Fournisseur Exemple", // provider
    actionCode: "AC123", // action code
    actionLabel: "Label d'action Exemple", // action label
    activityCode: "AC456", // acitivity code
    activityLabel: "Label d'activité Exemple", // activity label
};

export const PAYMENT_FLAT_ENTITY_WITH_NULLS = {
    uniqueId: "12345678901234", // uniqueId
    siret: "12345678901234", // siret
    siren: "123456789", // siren
    amount: 1000, // operation amount
    operationDate: new Date("2023-04-01"), // operation date
    programName: null, // program
    programNumber: 1, // program number
    mission: "Mission Exemple", // mission
    ministry: "Ministère Exemple", // ministry
    ministryAcronym: null, // ministry acronym
    ej: "EJ Exemple", // EJ
    provider: "Fournisseur Exemple", // provider
    actionCode: "AC123", // action code
    actionLabel: "Label d'action Exemple", // action label
    activityCode: "AC456", // acitivity code
    activityLabel: "Label d'activité Exemple", // activity label
};
