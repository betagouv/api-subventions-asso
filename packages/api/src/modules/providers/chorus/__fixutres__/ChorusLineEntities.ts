import { ObjectId } from "mongodb";
import { ChorusService } from "../chorus.service";
import ChorusLineEntity from "../entities/ChorusLineEntity";

const NUMERO_TIER = "SARA ROSIGNOL";
const CENTRE_FINANCIER = "CABANE A OISEAUX";

const MONGO_ID = new ObjectId("653fc28e8f1dc27bebd9fe03");

const DEFAULT_PARSED_DATA = {
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
};

const DEFAULT_INDEXED_INFORMATION = {
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
};

export const DEFAULT_CHORUS_LINE_ENTITY = {
    indexedInformations: DEFAULT_INDEXED_INFORMATION,
    data: DEFAULT_PARSED_DATA,
    provider: "Chorus",
};

export const DEFAULT_CHORUS_LINE_DOCUMENT = new ChorusLineEntity(
    ChorusService.buildUniqueId(DEFAULT_CHORUS_LINE_ENTITY.indexedInformations),
    DEFAULT_INDEXED_INFORMATION,
    DEFAULT_PARSED_DATA,
    MONGO_ID,
);
