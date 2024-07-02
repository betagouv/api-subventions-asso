import { ObjectId } from "mongodb";
import { ParserInfo } from "../../../../@types";
import { ExcelDateToJSDate } from "../../../../shared/helpers/ParserHelper";
import IChorusIndexedInformations from "../@types/IChorusIndexedInformations";

export default class ChorusLineEntity {
    public provider = "Chorus";

    public static indexedInformationsPath: { [key: string]: ParserInfo } = {
        // TODO <string|number>
        ej: {
            path: ["N° EJ"],
        },
        siret: { path: ["Code taxe 1"] },
        codeBranche: { path: ["Branche CODE"] },
        branche: { path: ["Branche"] },
        activitee: { path: ["Référentiel de programmation"] },
        codeActivitee: { path: ["Référentiel de programmation CODE"] },
        numeroDemandePayment: { path: ["N° DP"] },
        numeroTier: { path: ["Fournisseur payé (DP)"] },
        centreFinancier: { path: ["Centre financier"] },
        codeCentreFinancier: { path: ["Centre financier CODE"] },
        domaineFonctionnel: { path: ["Domaine fonctionnel"] },
        codeDomaineFonctionnel: { path: ["Domaine fonctionnel CODE"] },
        amount: {
            path: [["EUR", "Montant payé"]],
            adapter: value => {
                if (!value || typeof value === "number") return value;

                return parseFloat(value.replace("\r", "").replace(" ", "").replace(",", "."));
            },
        },
        dateOperation: {
            path: ["Date de dernière opération sur la DP"],
            adapter: value => {
                if (!value) return value;
                if (value != parseInt(value, 10).toString()) {
                    const [day, month, year] = value.split(/[/.]/).map(v => parseInt(v, 10));
                    return new Date(Date.UTC(year, month - 1, day));
                }

                return ExcelDateToJSDate(parseInt(value, 10));
            },
        },
    };

    constructor(
        public uniqueId: string,
        public indexedInformations: IChorusIndexedInformations,
        public data: unknown,
        public _id?: ObjectId,
    ) {}
}
