import { ChorusPayment } from "dto";
import ChorusLineEntity from "../entities/ChorusLineEntity";
import DEFAULT_ASSOCIATION from "../../../../../tests/__fixtures__/association.fixture";
import { ChorusLineDto } from "../adapters/chorusLineDto";

export const HEADERS = [
    "N° EJ",
    "Fournisseur payé (DP)",
    "",
    "Branche",
    "",
    "Code taxe 1",
    "Référentiel de programmation",
    "",
    "N° DP",
    "Date de dernière opération sur la DP",
    "Centre financier",
    "",
    "Domaine fonctionnel",
    "",
    "Montant payé",
];

export const FILLED_HEADERS = [
    "N° EJ",
    "Fournisseur payé (DP) CODE",
    "Fournisseur payé (DP)",
    "Branche CODE",
    "Branche",
    "Code taxe 1",
    "Référentiel de programmation CODE",
    "Référentiel de programmation",
    "N° DP",
    "Date de dernière opération sur la DP",
    "Centre financier CODE",
    "Centre financier",
    "Domaine fonctionnel CODE",
    "Domaine fonctionnel",
    "Montant payé",
];

export const PAGES = [
    [
        "0001821732",
        "1000011111",
        "ASSO 1",
        "Z039",
        "Associations",
        "32534654200001",
        "BG00/077601000201",
        "Appels a projet",
        "000195567",
        "12/07/2023",
        "AA01/0776-C001-4000",
        "UO DGER XXXX-C001",
        "1111-01-02",
        "Appels à projet",
        89988.3,
    ],
    [
        "0002822326",
        "2000002222",
        "ASSO 2",
        "Z039",
        "Associations",
        "77568577900002",
        "BG00/077601000201",
        "Appels a projet",
        "000212692",
        "21/04/2023",
        "AA01/0776-C001-4000",
        "UO DGER",
        "XXXX-C001",
        "1111-01-02",
        "Appels à projet",
        89931.9,
    ],
    [
        "0003823760",
        "3000013333",
        "ASSO 3",
        "Z039",
        "Associations",
        "32984397300003",
        "BG00/010200002004",
        "PIC-Prog nat-Accom",
        "000311141",
        "05/05/2023",
        "AA99/0102-DR25-DR25",
        "UO régionale",
        "1234-03",
        "Plan inv compétences",
        62655.2,
    ],
];

export const PARSED_DATA = [
    {
        "N° EJ": "0001821732",
        "Fournisseur payé (DP) CODE": "1000011111",
        "Fournisseur payé (DP)": "ASSO 1",
        "Branche CODE": "Z039",
        Branche: "Associations",
        "Code taxe 1": "32534654200001",
        "Référentiel de programmation CODE": "BG00/077601000201",
        "Référentiel de programmation": "Appels a projet",
        "N° DP": "000195567",
        "Date de dernière opération sur la DP": "12/07/2023",
        "Centre financier": "AA01/0776-C001-4000",
        "Centre financier CODE": "UO DGER XXXX-C001",
        "Domaine fonctionnel": "1111-01-02",
        "Domaine fonctionnel CODE": "Appels à projet",
        "Montant payé": 89988.3,
    },
    {
        "N° EJ": "0002822326",
        "Fournisseur payé (DP) CODE": "2000002222",
        "Fournisseur payé (DP)": "ASSO 2",
        "Branche CODE": "Z039",
        Branche: "Associations",
        "Code taxe 1": "77568577900002",
        "Référentiel de programmation CODE": "BG00/077601000201",
        "Référentiel de programmation": "Appels a projet",
        "N° DP": "000212692",
        "Date de dernière opération sur la DP": "21/04/2023",
        "Centre financier": "AA01/0776-C001-4000",
        "Centre financier CODE": "UO DGER",
        "Domaine fonctionnel": "XXXX-C001",
        "Domaine fonctionnel CODE": "1111-01-02",
        "Montant payé": 89931.9,
    },
    {
        "N° EJ": "0003823760",
        "Fournisseur payé (DP) CODE": "3000013333",
        "Fournisseur payé (DP)": "ASSO 3",
        "Branche CODE": "Z039",
        Branche: "Associations",
        "Code taxe 1": "32984397300003",
        "Référentiel de programmation CODE": "BG00/010200002004",
        "Référentiel de programmation": "PIC-Prog nat-Accom",
        "N° DP": "000311141",
        "Date de dernière opération sur la DP": "05/05/2023",
        "Centre financier": "AA99/0102-DR25-DR25",
        "Centre financier CODE": "UO régionale",
        "Domaine fonctionnel": "1234-03",
        "Domaine fonctionnel CODE": "Plan inv compétences",
        "Montant payé": 62655.2,
    },
];

// Example of duplicate in V004 but solved in V005 with "N° poste EJ" and "N° poste DP"
export const RAW_DUPLICATE_V004 = [
    {
        "N° EJ": "2101766485",
        "N° poste EJ": "1",
        "Fournisseur payé (DP) CODE": "1000321116",
        "Fournisseur payé (DP)": "ASS GESTION",
        "Branche CODE": "Z039",
        Branche: "Associations",
        "Code taxe 1": "11111111100010",
        "No TVA 3 (COM-RIDET ou TAHITI)": "#",
        "Référentiel de programmation CODE": "BG00/021701010523",
        "Référentiel de programmation": "Social restauration",
        Société: "NORP",
        "Exercice comptable": "2023",
        "N° DP": "100053424",
        "N° poste DP": "1",
        "Date de dernière opération sur la DP": 45100,
        "Centre financier CODE": "BG00/0217-SGAC-ASPR",
        "Centre financier": "Action Soc et  PRP",
        "Domaine fonctionnel CODE": "0217-07-05",
        "Domaine fonctionnel": "Moyens HT2 RH",
        "Montant payé": 110.94,
    },
    {
        "N° EJ": "2101766485",
        "N° poste EJ": "1",
        "Fournisseur payé (DP) CODE": "1000321116",
        "Fournisseur payé (DP)": "ASS GESTION",
        "Branche CODE": "Z039",
        Branche: "Associations",
        "Code taxe 1": "11111111100010",
        "No TVA 3 (COM-RIDET ou TAHITI)": "#",
        "Référentiel de programmation CODE": "BG00/02160401012A",
        "Référentiel de programmation": "Act°soc : restaurati",
        Société: "NORP",
        "Exercice comptable": "2023",
        "N° DP": "100053424",
        "N° poste DP": "2",
        "Date de dernière opération sur la DP": 45100,
        "Centre financier CODE": "BG00/0216-CPRH-CASR",
        "Centre financier": "0216-CPRH-CASR",
        "Domaine fonctionnel CODE": "0216-04-01",
        "Domaine fonctionnel": "Action sociale : offre de",
        "Montant payé": 278.96,
    },
];

export const ENTITY_WITH_RIDET = {
    uniqueId: "de175292263fdd97b222a754309df07f",
    indexedInformations: {
        ej: "0001821732",
        numPosteEJ: 2,
        siret: DEFAULT_ASSOCIATION.siret,
        codeBranche: "Z039",
        branche: "Associations",
        activitee: "Appels a projet",
        codeActivitee: "3222",
        numeroDemandePaiement: "000195567",
        numPosteDP: 3,
        codeSociete: "456",
        exercice: 2023,
        numeroTier: "ASSO 1",
        centreFinancier: "UO DGER XXXX-C001",
        codeCentreFinancier: "AA01/0776-C001-4000",
        domaineFonctionnel: "Appels à projet",
        codeDomaineFonctionnel: "0101-01-02",
        amount: 89988.3,
        dateOperation: new Date("2023-07-12T00:00:00.000Z"),
    },
    data: {
        "N° EJ": "0001821732",
        "Fournisseur payé (DP) CODE": "1000011111",
        "Fournisseur payé (DP)": "ASSO 1",
        "Branche CODE": "Z039",
        Branche: "Associations",
        "Code taxe 1": "#",
        "No TVA 3 (COM-RIDET ou TAHITI)": "0231852001",
        "Référentiel de programmation CODE": "BG00/077601003222",
        "Référentiel de programmation": "Appels a projet",
        "N° DP": "000195567",
        Société: "HNOR",
        "Exercice comptable": "2023",
        "Date de dernière opération sur la DP": 45119,
        "Centre financier CODE": "AA01/0776-C001-4000",
        "Centre financier": "UO DGER XXXX-C001",
        "Domaine fonctionnel CODE": "0101-01-02",
        "Domaine fonctionnel": "Appels à projet",
        "Montant payé": 89988.3,
    } as ChorusLineDto,
    _id: undefined,
    provider: "Chorus",
    updated: new Date("2020-01-01"),
};

export const ENTITIES: ChorusLineEntity[] = [
    {
        uniqueId: "de175292263fdd97b222a754309df07f",
        indexedInformations: {
            ej: "0001821732",
            numPosteEJ: 2,
            siret: DEFAULT_ASSOCIATION.siret,
            codeBranche: "Z039",
            branche: "Associations",
            activitee: "Appels a projet",
            codeActivitee: "3222",
            numeroDemandePaiement: "000195567",
            numPosteDP: 3,
            codeSociete: "456",
            exercice: 2023,
            numeroTier: "ASSO 1",
            centreFinancier: "UO DGER XXXX-C001",
            codeCentreFinancier: "AA01/0776-C001-4000",
            domaineFonctionnel: "Appels à projet",
            codeDomaineFonctionnel: "0101-01-02",
            amount: 89988.3,
            dateOperation: new Date("2023-07-12T00:00:00.000Z"),
        },
        data: {
            "N° EJ": "0001821732",
            "Fournisseur payé (DP) CODE": "1000011111",
            "Fournisseur payé (DP)": "ASSO 1",
            "Branche CODE": "Z039",
            Branche: "Associations",
            "Code taxe 1": DEFAULT_ASSOCIATION.siret,
            "Référentiel de programmation CODE": "BG00/077601003222",
            "Référentiel de programmation": "Appels a projet",
            "N° DP": "000195567",
            Société: "HNOR",
            "Exercice comptable": "2023",
            "Date de dernière opération sur la DP": 45119,
            "Centre financier CODE": "AA01/0776-C001-4000",
            "Centre financier": "UO DGER XXXX-C001",
            "Domaine fonctionnel CODE": "0101-01-02",
            "Domaine fonctionnel": "Appels à projet",
            "Montant payé": 89988.3,
        } as ChorusLineDto,
        _id: undefined,
        provider: "Chorus",
        updated: new Date("2020-01-01"),
    },
    {
        uniqueId: "11d177d88edbd421e4eef4f2e8d42b28",
        indexedInformations: {
            ej: "0001821732",
            numPosteEJ: 21,
            siret: "77568577900002",
            codeBranche: "Z039",
            branche: "Associations",
            activitee: "Appels a projet",
            codeActivitee: "3222",
            numeroDemandePaiement: "000212692",
            numPosteDP: 2,
            codeSociete: "456",
            exercice: 2023,
            numeroTier: "ASSO 2",
            centreFinancier: "UO DGER",
            codeCentreFinancier: "AA01/0776-C001-4000",
            domaineFonctionnel: "0101-01-02",
            codeDomaineFonctionnel: "XXXX-C001",
            amount: 89931.9,
            dateOperation: new Date("2023-04-21T00:00:00.000Z"),
        },
        data: {
            "N° EJ": "0002822326",
            "Fournisseur payé (DP) CODE": "2000002222",
            "Fournisseur payé (DP)": "ASSO 2",
            "Branche CODE": "Z039",
            Branche: "Associations",
            "Code taxe 1": "77568577900002",
            "Référentiel de programmation CODE": "BG00/077601000201",
            "Référentiel de programmation": "Appels a projet",
            "N° DP": "000212692",
            "Exercice comptable": "2023",
            Société: "BRET",
            "Date de dernière opération sur la DP": 45037,
            "Centre financier CODE": "AA01/0776-C001-4000",
            "Centre financier": "UO DGER",
            "Domaine fonctionnel CODE": "0101-01-02",
            "Domaine fonctionnel": "DOMAINE FONCTIONNEL LABEL",
            "Montant payé": 89931.9,
        } as ChorusLineDto,
        _id: undefined,
        provider: "Chorus",
        updated: new Date("2020-01-01"),
    },
    {
        uniqueId: "8fa4002caaa720f63bbe2acf525419c0",
        indexedInformations: {
            ej: "0003823760",
            numPosteEJ: 2,
            siret: "32984397300003",
            codeBranche: "Z039",
            branche: "Associations",
            activitee: "PIC-Prog nat-Accom",
            codeActivitee: "3222",
            numeroDemandePaiement: "000311141",
            numPosteDP: 2,
            codeSociete: "456",
            exercice: 2023,
            numeroTier: "ASSO 3",
            centreFinancier: "UO régionale",
            codeCentreFinancier: "AA99/0102-DR25-DR25",
            domaineFonctionnel: "Plan inv compétences",
            codeDomaineFonctionnel: "0102-03",
            amount: 62655.2,
            dateOperation: new Date("2023-05-05T00:00:00.000Z"),
        },
        data: {
            "N° EJ": "0003823760",
            "Fournisseur payé (DP) CODE": "3000013333",
            "Fournisseur payé (DP)": "ASSO 3",
            "Branche CODE": "Z039",
            Branche: "Associations",
            "Code taxe 1": "32984397300003",
            "Référentiel de programmation CODE": "BG00/010200002004",
            "Référentiel de programmation": "PIC-Prog nat-Accom",
            "N° DP": "000311141",
            "Date de dernière opération sur la DP": 45051,
            "Centre financier CODE": "AA99/0102-DR25-DR25",
            Société: "BRET",
            "Exercice comptable": "2023",
            "Centre financier": "UO régionale",
            "Domaine fonctionnel CODE": "0102-03",
            "Domaine fonctionnel": "Plan inv compétences",
            "Montant payé": 62655.2,
        } as ChorusLineDto,
        _id: undefined,
        provider: "Chorus",
        updated: new Date("2020-01-01"),
    },
];

const buildProviderValue = value => ({
    value,
    provider: "chorus",
    type: typeof value,
    last_update: new Date("2022-06-06"),
});

// TODO: fill this with real data
export const PAYMENTS: ChorusPayment[] = [
    {
        ej: buildProviderValue(ENTITIES[0].indexedInformations.ej),
        versementKey: buildProviderValue(ENTITIES[0].indexedInformations.ej),
        siret: buildProviderValue(ENTITIES[0].indexedInformations.siret),
        amount: buildProviderValue(ENTITIES[0].indexedInformations.amount),
        dateOperation: buildProviderValue(ENTITIES[0].indexedInformations.dateOperation),
        centreFinancier: buildProviderValue(ENTITIES[0].indexedInformations.centreFinancier),
        domaineFonctionnel: buildProviderValue(ENTITIES[0].indexedInformations.domaineFonctionnel),
        bop: buildProviderValue(ENTITIES[0].indexedInformations.codeDomaineFonctionnel.slice(0, 4)),
        programme: buildProviderValue(
            `PROGRAM LABEL ${ENTITIES[0].indexedInformations.codeDomaineFonctionnel.slice(0, 4)}`,
        ),
        libelleProgramme: buildProviderValue(ENTITIES[0].indexedInformations.codeDomaineFonctionnel.slice(0, 4)),
    },
];
