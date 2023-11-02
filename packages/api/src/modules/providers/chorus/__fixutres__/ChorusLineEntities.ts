import { ObjectId } from "mongodb";

const NUMERO_TIER = "SARA ROSIGNOL";
const CENTRE_FINANCIER = "CABANE A OISEAUX";

export const DEFAULT_CHORUS_LINE_ENTITY = {
    _id: new ObjectId("653fc28e8f1dc27bebd9fe03"),
    uniqueId: "33499024900180-2103955300-Thu Feb 23 2023 01:00:00 GMT+0100 (heure normale d’Europe centrale)-7013.35",
    indexedInformations: {
        ej: "2103955300",
        siret: "33499024900180",
        codeBranche: "Z039",
        branche: "Associations",
        activitee: "XYZ- accompagnement",
        numeroDemandePayment: "100028941",
        numeroTier: NUMERO_TIER,
        centreFinancier: CENTRE_FINANCIER,
        codeCentreFinancier: "XX00/0177-D013-DD13",
        domaineFonctionnel: "Accompagnement social",
        codeDomaineFonctionnel: "0177-12-08",
        amount: 7013.35,
        dateOperation: new Date("2023-02-23T00:00:00.000Z"),
    },
    data: {
        "N° EJ": "2103955300",
        "Fournisseur payé (DP) CODE": "1001488375",
        "Fournisseur payé (DP)": NUMERO_TIER,
        "Branche CODE": "Z039",
        Branche: "Associations",
        "Code taxe 1": "33499024900180",
        "Référentiel de programmation CODE": "XX00/017701051213",
        "Référentiel de programmation": "CHRS- accompagnement",
        "N° DP": "100028941",
        "Date de dernière opération sur la DP": 44980,
        "Centre financier CODE": "XX00/0177-D013-DD13",
        "Centre financier": CENTRE_FINANCIER,
        "Domaine fonctionnel CODE": "0177-12-08",
        "Domaine fonctionnel": "Accompagnement social",
        "Montant payé": 7013.35,
    },
    provider: "Chorus",
};

export const paymentsWithDifferentDP = [
    DEFAULT_CHORUS_LINE_ENTITY,
    {
        _id: new ObjectId("653fc28e8f1dc27bebd9fe04"),
        uniqueId:
            "33499024900180-2103955300-Thu Feb 23 2023 01:00:00 GMT+0100 (heure normale d’Europe centrale)-7013.35",
        indexedInformations: {
            ej: "2103955300",
            siret: "33499024900180",
            codeBranche: "Z039",
            branche: "Associations",
            activitee: "CHRS- accompagnement",
            numeroDemandePayment: "100028942",
            numeroTier: NUMERO_TIER,
            centreFinancier: CENTRE_FINANCIER,
            codeCentreFinancier: "XX00/0177-D013-DD13",
            domaineFonctionnel: "Accompagnement social",
            codeDomaineFonctionnel: "0177-12-08",
            amount: 7013.35,
            dateOperation: new Date("2023-02-23T00:00:00.000Z"),
        },
        data: {
            "N° EJ": "2103955300",
            "Fournisseur payé (DP) CODE": "1001488375",
            "Fournisseur payé (DP)": NUMERO_TIER,
            "Branche CODE": "Z039",
            Branche: "Associations",
            "Code taxe 1": "33499024900180",
            "Référentiel de programmation CODE": "XX00/017701051213",
            "Référentiel de programmation": "CHRS- accompagnement",
            "N° DP": "100028942",
            "Date de dernière opération sur la DP": 44980,
            "Centre financier CODE": "XX00/0177-D013-DD13",
            "Centre financier": CENTRE_FINANCIER,
            "Domaine fonctionnel CODE": "0177-12-08",
            "Domaine fonctionnel": "Accompagnement social",
            "Montant payé": 7013.35,
        },
        provider: "Chorus",
    },
];
