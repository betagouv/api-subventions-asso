import { ObjectId } from "mongodb";
import ChorusLineEntity from "../../src/modules/providers/chorus/entities/ChorusLineEntity";

export const CHORUS_LAST_UPDATE = new Date("2022-03-12");

export const MOCK_DOCUMENTS: ChorusLineEntity[] = [
    {
        uniqueId: "1",
        updated: new Date("2023-05-02"),
        indexedInformations: {
            siret: "12345678911111",
            amount: 2000,
            dateOperation: new Date("2021-04-02"),
            codeCentreFinancier: "AA99/0102-DR25-DR25",
            domaineFonctionnel: "domaineFonctionnel_1",
            codeDomaineFonctionnel: "0143-03-01",
            numeroDemandePaiement: "numeroDemandePaiement_1",
            codeSociete: "AZE",
            exercice: 2021,
            codeActivitee: "BG00/014303000102",
            ej: "ej_1",
        },
    } as ChorusLineEntity,

    {
        uniqueId: "11",
        updated: new Date("2021-05-02"),
        indexedInformations: {
            siret: "12345678911111",
            amount: 2000,
            dateOperation: new Date("2021-04-02"),
            codeCentreFinancier: "AA99/0102-DR25-DR25",
            domaineFonctionnel: "domaineFonctionnel_1",
            codeDomaineFonctionnel: "0143-03-01",
            numeroDemandePaiement: "numeroDemandePaiement_1",
            codeSociete: "AZE",
            exercice: 2021,
            codeActivitee: "BG00/014303000102",
            ej: "ej_1",
        },
    } as ChorusLineEntity,

    {
        uniqueId: "2",
        updated: new Date("2022-06-03"),
        indexedInformations: {
            siret: "12345678911111",
            amount: 3000,
            dateOperation: new Date("2022-01-02"),
            codeCentreFinancier: "BG00/0180-CMED-C302",
            domaineFonctionnel: "domaineFonctionnel_2",
            codeDomaineFonctionnel: "0180-06-01",
            numeroDemandePaiement: "numeroDemandePaiement_2",
            codeSociete: "ZER",
            exercice: 2022,
            codeActivitee: "BG00/018000110101",
            ej: "ej_2",
        },
    } as ChorusLineEntity,

    {
        uniqueId: "3",
        updated: new Date("2023-05-02"),
        _id: new ObjectId("607f191e810c19729de860ed"),
        indexedInformations: {
            siret: "12345678911111",
            amount: 4000,
            dateOperation: new Date("2023-04-02"),
            codeCentreFinancier: "BG00/0224-DR45-D645",
            domaineFonctionnel: "domaineFonctionnel_3",
            codeDomaineFonctionnel: "0224-02-24",
            numeroDemandePaiement: "numeroDemandePaiement_3",
            codeSociete: "ZER",
            exercice: 2023,
            codeActivitee: "BG00/022400080205",
            ej: "ej_3",
        },
    } as ChorusLineEntity,

    {
        uniqueId: "4",
        updated: new Date("2022-06-22"),
        _id: new ObjectId("607f191e810c19729de860ee"),
        indexedInformations: {
            siret: "12345678911111",
            amount: 5000,
            dateOperation: new Date("2022-05-02"),
            codeCentreFinancier: "BG00/0147-LAMI-S034",
            domaineFonctionnel: "domaineFonctionnel_4",
            codeDomaineFonctionnel: "0147-01-10",
            numeroDemandePaiement: "numeroDemandePaiement_4",
            codeSociete: "ZER",
            exercice: 2022,
            codeActivitee: "BG00/014701010101",
            ej: "ej_4",
        },
    } as ChorusLineEntity,
];

export const PROGRAMS = [
    {
        code_programme: 143,
        label_programme: "programme_1",
        code_ministere: "A",
        mission: "mission_1",
    },

    {
        code_programme: 224,
        label_programme: "programme_3",
        code_ministere: "C",
        mission: "mission_3",
    },
    {
        code_programme: 147,
        label_programme: "programme_4",
        code_ministere: "D",
        mission: "mission_4",
    },
];

export const MINISTRIES = [
    {
        code: "A",
        label: "nom_ministere_1",
        sigle_ministere: "sigle_ministere_1",
    },

    {
        code: "B",
        label: "nom_ministere_2",
        sigle_ministere: "sigle_ministere_2",
    },
    {
        code: "D",
        label: "nom_ministere_4",
        sigle_ministere: "sigle_ministere_4",
    },
];

export const DOMAINES_FONCT = [
    {
        code: "0143-03-01",
        label: "libelle_action_1",
        code_programme: 143,
    },
    {
        code: "0180-06-01",
        label: "libelle_action_2",
        code_programme: 180,
    },
    {
        code: "0224-02-24",
        label: "libelle_action_3",
        code_programme: 224,
    },
];

export const REFS_PROGRAMMATION = [
    {
        code: "014303000102",
        label: "libelle_activite_1",
        code_programme: 143,
    },
    {
        code: "018000110101",
        label: "libelle_activite_2",
        code_programme: 180,
    },
    {
        code: "014701010101",
        label: "libelle_activite_4",
        code_programme: 147,
    },
];
export const DATA_BRETAGNE_DTOS = {
    ministere: MINISTRIES,
    "domaine-fonct": DOMAINES_FONCT,
    "ref-programmation": REFS_PROGRAMMATION,
};
