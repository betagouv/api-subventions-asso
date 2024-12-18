import ChorusLineEntity from "../../src/modules/providers/chorus/entities/ChorusLineEntity";
import { ENTITIES } from "../../src/modules/providers/chorus/__fixtures__/ChorusFixtures";
export const CHORUS_LAST_UPDATE = new Date("2022-03-12");

export const MOCK_DOCUMENTS: ChorusLineEntity[] = [
    // je change le siret pour que je puisse ordonner le snapshot par siret
    // je change l'exercice du première document pour qu'il ne soit pas enregistré lors de resyncExercice(2023)
    {
        ...ENTITIES[0],
        indexedInformations: {
            ...ENTITIES[0].indexedInformations,
            siret: "12345678901313",
            exercice: 2022,
            codeSociete: "HNOR",
        },
    },
    // je mets des entités avec le même paymentFlat uniqueId pour tester le groupement
    {
        ...ENTITIES[1],
        indexedInformations: {
            ...ENTITIES[1].indexedInformations,
            ej: "EJ_egale",
            codeDomaineFonctionnel: "0143-03-01",
            codeActivitee: "014303000102",
            siret: "12345678901212",
        },
    },
    {
        ...ENTITIES[2],
        indexedInformations: {
            ...ENTITIES[2].indexedInformations,
            ej: "EJ_egale",
            codeDomaineFonctionnel: "0143-03-01",
            codeActivitee: "014303000102",
            siret: "12345678901212",
            dateOperation: new Date("2023-04-21T00:00:00.000Z"),
        },
    },

    {
        ...ENTITIES[2],
        uniqueId: "newUniqueId",
        indexedInformations: { ...ENTITIES[2].indexedInformations, siret: "12345678901414" },
    },
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
