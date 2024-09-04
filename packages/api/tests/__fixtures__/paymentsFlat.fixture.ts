import { ObjectId, WithId } from "mongodb";
import ChorusLineEntity from "../../src/modules/providers/chorus/entities/ChorusLineEntity";

export const CHORUS_LAST_UPDATE = new Date("2022-03-12");

export const MOCK_DOCUMENT: WithId<ChorusLineEntity>[] = [
    {
        uniqueId: "uniqueId_1",
        updated: new Date("2021-05-02"),
        _id: new ObjectId("607f191e810c19729de860eb"),
        indexedInformations: {
            siret: "12345678911111",
            amount: 2000,
            dateOperation: new Date("2021-04-02"),
            codeCentreFinancier: "AA99/0102-DR25-DR25",
            domaineFonctionnel: "domaineFonctionnel_1",
            codeDomaineFonctionnel: "0143-03-01",
            numeroDemandePayment: "numeroDemandePayment_1",
            codeSociete: "AZE",
            exercice: 2021,
            codeActivitee: "BG00/014303000102",
            ej: "ej_1",
        },
    } as WithId<ChorusLineEntity>,
    {
        uniqueId: "uniqueId_2",
        updated: new Date("2022-02-03"),
        _id: new ObjectId("507f291e810c19729de860ec"),
        indexedInformations: {
            siret: "12345678911111",
            amount: 3000,
            dateOperation: new Date("2022-01-02"),
            codeCentreFinancier: "BG00/0180-CMED-C302",
            domaineFonctionnel: "domaineFonctionnel_2",
            codeDomaineFonctionnel: "0180-06-01",
            numeroDemandePayment: "numeroDemandePayment_2",
            codeSociete: "ZER",
            exercice: 2022,
            codeActivitee: "BG00/018000110101",
            ej: "ej_2",
        },
    } as WithId<ChorusLineEntity>,

    {
        uniqueId: "uniqueId_3",
        updated: new Date("2023-05-02"),
        _id: new ObjectId("607f191e810c19729de860ed"),
        indexedInformations: {
            siret: "12345678911111",
            amount: 4000,
            dateOperation: new Date("2023-04-02"),
            codeCentreFinancier: "BG00/0224-DR45-D645",
            domaineFonctionnel: "domaineFonctionnel_3",
            codeDomaineFonctionnel: "0224-02-24",
            numeroDemandePayment: "numeroDemandePayment_3",
            codeSociete: "ZER",
            exercice: 2023,
            codeActivitee: "BG00/022400080205",
            ej: "ej_3",
        },
    } as WithId<ChorusLineEntity>,

    {
        uniqueId: "uniqueId_4",
        updated: new Date("2022-06-22"),
        _id: new ObjectId("607f191e810c19729de860ee"),
        indexedInformations: {
            siret: "12345678911111",
            amount: 5000,
            dateOperation: new Date("2022-05-02"),
            codeCentreFinancier: "BG00/0147-LAMI-S034",
            domaineFonctionnel: "domaineFonctionnel_4",
            codeDomaineFonctionnel: "0147-01-10",
            numeroDemandePayment: "numeroDemandePayment_4",
            codeSociete: "ZER",
            exercice: 2022,
            codeActivitee: "BG00/014701010101",
            ej: "ej_4",
        },
    } as WithId<ChorusLineEntity>,
];

/*
const PAYMENT_FLAT_DBO_EXPECTED = [
    {
        _id: new ObjectId("607f191e810c19729de860eb"),
        uniqueId: "uniqueId_1",
        siret : "12345678911111",
        siren : "123456789",
        montant : 2000,
        dateOperation  : new Date("2021-04-02"),
    }
]
    */
export const MOCK_CURSOR = {
    next: jest
        .fn()
        .mockReturnValueOnce(MOCK_DOCUMENT[0])
        .mockReturnValueOnce(MOCK_DOCUMENT[1])
        .mockReturnValueOnce(MOCK_DOCUMENT[2])
        .mockReturnValueOnce(MOCK_DOCUMENT[3])
        .mockReturnValueOnce(null),
};

export const PROGRAMS = {
    "143": {
        code_programme: 143,
        label_programme: "programme_1",
        code_ministere: "A",
        mission: "mission_1",
    },

    "224": {
        code_programme: 224,
        label_programme: "programme_3",
        code_ministere: "C",
        mission: "mission_3",
    },
    "147": {
        code_programme: 147,
        label_programme: "programme_4",
        code_ministere: "D",
        mission: "mission_4",
    },
};

export const MINISTRIES = {
    A: {
        code_ministere: "A",
        nom_ministere: "nom_ministere_1",
        sigle_ministere: "sigle_ministere_1",
    },

    B: {
        code_ministere: "B",
        nom_ministere: "nom_ministere_2",
        sigle_ministere: "sigle_ministere_2",
    },
    D: {
        code_ministere: "D",
        nom_ministere: "nom_ministere_4",
        sigle_ministere: "sigle_ministere_4",
    },
};

export const DOMAINES_FONCT = {
    "0143-03-01": {
        code_action: "0143-03-01",
        libelle_action: "libelle_action_1",
        code_programme: 143,
    },
    "0180-06-01": {
        code_action: "0180-06-01",
        libelle_action: "libelle_action_2",
        code_programme: 180,
    },
    "0224-02-24": {
        code_action: "0224-02-24",
        libelle_action: "libelle_action_3",
        code_programme: 224,
    },
};

export const REFS_PROGRAMMATION = {
    "014303000102": {
        code_activite: "014303000102",
        libelle_activite: "libelle_activite_1",
        code_programme: 143,
    },
    "018000110101": {
        code_activite: "018000110101",
        libelle_activite: "libelle_activite_2",
        code_programme: 180,
    },
    "014701010101": {
        code_activite: "014701010101",
        libelle_activite: "libelle_activite_4",
        code_programme: 147,
    },
};
export const ALL_DATA_BRETAGNE_DATA = {
    programs: PROGRAMS,
    ministries: MINISTRIES,
    domainesFonct: DOMAINES_FONCT,
    refsProgrammation: REFS_PROGRAMMATION,
};

/*
export const MOCK_DATA_BRETAGNE_DOCUMENT_DATA = [
    {
        programCode: 143,
        activityCode: "014303000102",
        actionCode: "0143-03-01",
        programEntity: PROGRAMS["143"],
        ministryEntity: MINISTRIES["A"],
        domaineFonctEntity: DOMAINES_FONCT["0143-03-01"],
        refProgrammationEntity: REFS_PROGRAMMATION["014303000102"],
    },

    {
        programCode: 180,
        activityCode: "018000110101",
        actionCode: "0180-06-01",
        programEntity: undefined,
        ministryEntity: undefined,
        domaineFonctEntity: DOMAINES_FONCT["0180-06-01"],
        refProgrammationEntity: REFS_PROGRAMMATION["018000110101"],
    },

    {
        programCode: 224,
        activityCode: "022400080205",
        actionCode: "0224-02-24",
        programEntity: PROGRAMS["224"],
        ministryEntity: undefined,
        domaineFonctEntity: DOMAINES_FONCT["0224-02-24"],
        refProgrammationEntity: undefined,
    },

    {
        programCode: 147,
        activityCode: "014701010101",
        actionCode: "0147-01-10",
        programEntity: PROGRAMS["147"],
        ministryEntity: MINISTRIES["D"],
        domaineFonctEntity: DOMAINES_FONCT["0147-01-10"],
        refProgrammationEntity: REFS_PROGRAMMATION["014701010101"],
    }
    
]
*/
