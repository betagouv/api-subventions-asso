import { DocumentDto } from "dto";

export const DOCUMENT_DTO: DocumentDto = {
    type: {
        type: "string",
        value: "Avis de situation (INSEE)",
        provider: "INSEE",
        last_update: new Date("2024-01-15"),
    },
    url: {
        type: "string",
        value: "https://api-avis-situation-sirene.insee.fr/identification/pdf/{identifiant-document}",
        provider: "INSEE",
        last_update: new Date("2024-01-15"),
    },
    nom: {
        type: "string",
        value: "avis-situation2023.pdf",
        provider: "INSEE",
        last_update: new Date("2024-01-15"),
    },
    __meta__: { siret: "10000000000012" },
};

export const DOCUMENT_RIB_DTO: DocumentDto = {
    type: { type: "string", value: "RIB", provider: "Sirene", last_update: new Date("2024-01-15") },
    url: {
        type: "string",
        value: "https://api.sirene.fr/rib/12345678900012.pdf",
        provider: "Sirene",
        last_update: new Date("2024-01-15"),
    },
    nom: {
        type: "string",
        value: "rib_12345678900012.pdf",
        provider: "Sirene",
        last_update: new Date("2024-01-15"),
    },
    __meta__: { siret: "12345678900012" },
};
