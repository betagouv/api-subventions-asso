import { ParserInfo, ParserPath } from "../../../@types";
import { ScdlGrantDbo } from "../datagouv/@types/ScdlGrantDbo";

export default class ScdlGrantEntity {
    public provider = "data.gouv";

    // will have to be enriched on importing variants of SCDL
    public static InformationsPath: {
        [key: string]: ParserPath | ParserInfo;
    } = {
        allocatorName: ["nomAttribuant"],
        allocatorSiret: ["idAttribuant"],
        conventionDate: {
            path: ["dateConvention"],
            adapter: value => (value ? new Date(value) : value),
        },
        decisionReference: ["referenceDecision"],
        associationName: ["nomBeneficiaire"],
        associationSiret: ["idBeneficiaire"],
        object: ["objet"],
        amount: {
            path: ["montant"],
            adapter: value => (value ? parseFloat(value) : value),
        },
        paymentConditions: ["conditionsVersement"],
        paymentStartDate: {
            path: ["datesPeriodeVersement"],
            adapter: value => (value ? new Date(value.split("/")[0]) : value),
        },
        paymentEndDate: {
            path: ["datesPeriodeVersement"],
            adapter: value => (value ? new Date(value.split("/")[1]) : value),
        },
        idRAE: ["idRAE"],
        UeNotification: {
            path: ["notificationUE"],
            adapter: value => {
                if (value === "oui") return true;
                if (value === "non") return false;
                return undefined;
            },
        },
        grantPercentage: {
            path: ["pourcentageSubvention"],
            adapter: value => (value ? parseFloat(value) : value),
        },
    };

    constructor(public data: ScdlGrantDbo, public dataEditor: string) {}
}
