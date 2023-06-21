import { ParserInfo, ParserPath } from "../../../../@types";
import { ScdlEtalabDbo } from "../@types/ScdlEtalabDbo";

export default class DataGouvScdl {
    public provider = "data.gouv";

    // will have to be enriched on importing variants of SCDL
    public static InformationsPath: {
        [key: string]: ParserPath | ParserInfo;
    } = {
        allocatorName: ["nomAttribuant"],
        allocatorSiret: ["idAttribuant"],
        conventionDate: {
            path: ["dateConvention"],
            adapter: value => {
                if (!value) return value;
                return new Date(value);
            },
        },
        decisionReference: ["referenceDecision"],
        associationName: ["nomBeneficiaire"],
        associationSiret: ["idBeneficiaire"],
        object: ["objet"],
        amount: {
            path: ["montant"],
            adapter: value => {
                if (!value) return value;
                return parseFloat(value);
            },
        },
        paymentConditions: ["conditionsVersement"],
        paymentStartDate: {
            path: ["datesPeriodeVersement"],
            adapter: value => {
                if (!value) return value;
                return new Date(value.split("/")[0]);
            },
        },
        paymentEndDate: {
            path: ["datesPeriodeVersement"],
            adapter: value => {
                if (!value) return value;
                return new Date(value.split("/")[1]);
            },
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
            adapter: value => {
                if (!value) return value;
                return parseFloat(value);
            },
        },
    };

    constructor(public data: ScdlEtalabDbo, public dataEditor: string) {}
}
