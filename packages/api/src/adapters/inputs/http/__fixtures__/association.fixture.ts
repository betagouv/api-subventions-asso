import { Association } from "dto";

export const ASSOCIATION_DTO: Association = {
    siren: [
        {
            type: "string",
            value: "10000000000012",
            provider: "provider-siret",
            last_update: new Date("2024-01-15"),
        },
    ],
    rna: [
        {
            type: "string",
            value: "W751234567",
            provider: "provider-rna",
            last_update: new Date("2024-01-15"),
        },
    ],
    denomination_siren: [
        {
            type: "string",
            value: "Association Exemple",
            provider: "provider-siret",
            last_update: new Date("2024-01-15"),
        },
    ],
    denomination_rna: [
        {
            type: "string",
            value: "Association Exemple",
            provider: "provider-rna",
            last_update: new Date("2024-01-15"),
        },
    ],
};
