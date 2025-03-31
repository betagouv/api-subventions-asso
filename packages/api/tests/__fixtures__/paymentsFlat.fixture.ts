import ChorusLineEntity from "../../src/modules/providers/chorus/entities/ChorusLineEntity";
import { ENTITIES } from "../../src/modules/providers/chorus/__fixtures__/ChorusFixtures";
import { ChorusLineDto } from "../../src/modules/providers/chorus/@types/ChorusLineDto";
export const CHORUS_LAST_UPDATE = new Date("2022-03-12");

export const MOCK_DOCUMENTS: ChorusLineEntity[] = [
    // je change le siret pour que je puisse ordonner le snapshot par siret
    // je change l'exercice du première document pour qu'il ne soit pas enregistré lors de resyncExercice(2023)
    {
        ...ENTITIES[0],
        data: {
            ...(ENTITIES[0].data as ChorusLineDto),
            "Code taxe 1": "12345678901313",
            "Exercice comptable": "2022",
        },
    },
    // je mets des entités avec le même paymentFlat uniqueId pour tester le groupement
    {
        ...ENTITIES[1],
        data: {
            ...(ENTITIES[1].data as ChorusLineDto),
            "N° EJ": "EJ_egale",
            "Domaine fonctionnel CODE": "0143-03-01",
            "Référentiel de programmation CODE": "014303000102",
            "Code taxe 1": "12345678901212",
        },
    },
    {
        ...ENTITIES[2],
        data: {
            ...(ENTITIES[2].data as ChorusLineDto),
            "N° EJ": "EJ_egale",
            "Domaine fonctionnel CODE": "0143-03-01",
            "Référentiel de programmation CODE": "014303000102",
            "Code taxe 1": "12345678901212",
            "Date de dernière opération sur la DP": 45037,
            "Centre financier CODE": "AA01/0776-C001-4000",
        },
    },

    {
        ...ENTITIES[2],
        uniqueId: "newUniqueId",
        data: { ...(ENTITIES[2].data as ChorusLineDto), "Code taxe 1": "12345678901414" },
    },
];

export const PROGRAMS = [
    {
        code_programme: 163,
        label_programme: "programme_1",
        code_ministere: "A",
        mission: "mission_1",
    },
    {
        code_programme: 361,
        label_programme: "programme_2",
        code_ministere: "B",
        mission: "mission_2",
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
    {
        code_programme: 101,
        label_programme: "programme_5",
        code_ministere: "E",
        mission: "mission_5",
    },
    {
        code_programme: 143,
        label_programme: "programme_6",
        code_ministere: "F",
        mission: "mission_6",
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
        code: "C",
        label: "nom_ministere_3",
        sigle_ministere: "sigle_ministere_3",
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
    {
        code: "03354-04-25",
        label: "libelle_action_4",
        code_programme: 361,
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
    {
        code: "053671010101",
        label: "libelle_activite_3",
        code_programme: 361,
    },
];
export const DATA_BRETAGNE_DTOS = {
    ministere: MINISTRIES,
    "domaine-fonct": DOMAINES_FONCT,
    "ref-programmation": REFS_PROGRAMMATION,
};
