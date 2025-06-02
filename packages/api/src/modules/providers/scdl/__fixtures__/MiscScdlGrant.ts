import { ScdlGrantDbo } from "../dbo/ScdlGrantDbo";
import MiscScdlGrantEntity from "../entities/MiscScdlGrantEntity";
import MiscScdlProducer from "./MiscScdlProducer";

const MiscScdlGrant: MiscScdlGrantEntity = {
    producerSlug: MiscScdlProducer.slug,
    allocatorName: MiscScdlProducer.name,
    allocatorSiret: MiscScdlProducer.siret,
    exercice: 2023,
    conventionDate: new Date("2017-06-27"),
    decisionReference: "2017-03-103",
    associationName: "Association Les Petits Débrouillards Bretagne",
    associationSiret: "38047555800058",
    associationRna: "W123456789",
    object: "Animations climat-énergie dans les lycées de la région",
    amount: 47800.2,
    paymentNature: "aide en numéraire",
    paymentConditions: "unique",
    paymentStartDate: new Date("2017-03-14"),
    paymentEndDate: new Date("2018-03-14"),
    idRAE: "12345",
    UeNotification: true,
    grantPercentage: 0.5,
    aidSystem: "65d5b6c7-102c-4440-ac3b-768f708edc0a",
} as ScdlGrantDbo;

export const MISC_SCDL_GRANT_DBO_FIXTURE: ScdlGrantDbo = { _id: "6836edb7fed76abae662757f", ...MiscScdlGrant };

export default MiscScdlGrant;
