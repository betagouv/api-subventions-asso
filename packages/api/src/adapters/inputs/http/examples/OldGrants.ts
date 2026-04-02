import { ApplicationStatus, DemandeSubvention, Payment } from "dto";

export const OLD_PAYMENT_DTO: Payment = {
    exerciceBudgetaire: {
        type: "number",
        value: 2023,
        provider: "provider",
        last_update: new Date("2024-01-15"),
    },
    versementKey: {
        type: "string",
        value: "CHORUS-2023-001",
        provider: "provider",
        last_update: new Date("2024-01-15"),
    },
    siret: {
        type: "string",
        value: "10000000000012",
        provider: "provider",
        last_update: new Date("2024-01-15"),
    },
    amount: {
        type: "number",
        value: 15000,
        provider: "provider",
        last_update: new Date("2024-01-15"),
    },
    dateOperation: {
        type: "string",
        value: new Date("2023-06-30"),
        provider: "provider",
        last_update: new Date("2024-01-15"),
    },
    programme: {
        type: "string",
        value: "163",
        provider: "provider",
        last_update: new Date("2024-01-15"),
    },
    ej: {
        type: "string",
        value: "1234567890",
        provider: "provider",
        last_update: new Date("2024-01-15"),
    },
};

export const OLD_APPLICATON_DTO: DemandeSubvention = {
    service_instructeur: {
        type: "string",
        value: "DRAJES Île-de-France",
        provider: "provider slug",
        last_update: new Date("2024-01-15"),
    },
    siret: {
        type: "string",
        value: "10000000000012",
        provider: "provider slug",
        last_update: new Date("2024-01-15"),
    },
    statut_label: {
        type: "string",
        value: ApplicationStatus.GRANTED,
        provider: "provider slug",
        last_update: new Date("2024-01-15"),
    },
    status: {
        type: "string",
        value: "Accordé",
        provider: "provider slug",
        last_update: new Date("2024-01-15"),
    },
};
