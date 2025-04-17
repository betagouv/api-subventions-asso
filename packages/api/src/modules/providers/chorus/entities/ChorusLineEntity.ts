import { ObjectId } from "mongodb";
import { ParserInfo } from "../../../../@types";
import IChorusIndexedInformations from "../@types/IChorusIndexedInformations";
import { GenericParser } from "../../../../shared/GenericParser";
import { ChorusLineDto } from "../@types/ChorusLineDto";

export default class ChorusLineEntity {
    public provider = "Chorus";

    private static santitizeFloat = value => {
        if (!value || typeof value === "number") return value;

        return parseFloat(value.replaceAll("\r", "").replaceAll(" ", "").replaceAll(",", "."));
    };

    public static indexedInformationsPath: { [key: string]: ParserInfo } = {
        // TODO <string|number>
        ej: {
            path: ["N° EJ"],
        },
        numPosteEJ: { path: ["N° poste EJ"] },
        siret: { path: ["Code taxe 1"] },
        codeBranche: { path: ["Branche CODE"] },
        branche: { path: ["Branche"] },
        activitee: { path: ["Référentiel de programmation"] },
        codeActivitee: { path: ["Référentiel de programmation CODE"] },
        numeroDemandePaiement: { path: ["N° DP"] },
        numPosteDP: { path: ["N° poste DP"] },
        codeSociete: { path: ["Société"] },
        exercice: {
            path: ["Exercice comptable"],
            adapter: ChorusLineEntity.santitizeFloat,
        },
        numeroTier: { path: ["Fournisseur payé (DP)"] },
        centreFinancier: { path: ["Centre financier"] },
        codeCentreFinancier: { path: ["Centre financier CODE"] },
        domaineFonctionnel: { path: ["Domaine fonctionnel"] },
        codeDomaineFonctionnel: { path: ["Domaine fonctionnel CODE"] },
        amount: {
            path: [["EUR", "Montant payé"]],
            adapter: ChorusLineEntity.santitizeFloat,
        },
        dateOperation: {
            path: ["Date de dernière opération sur la DP"],
            adapter: value => {
                if (!value) return value;
                if (value != parseInt(value, 10).toString()) {
                    const [day, month, year] = value.split(/[/.]/).map(v => parseInt(v, 10));
                    return new Date(Date.UTC(year, month - 1, day));
                }

                return GenericParser.ExcelDateToJSDate(parseInt(value, 10));
            },
        },
    };

    constructor(
        public uniqueId: string,
        public updated: Date,
        public indexedInformations: IChorusIndexedInformations,
        public data: ChorusLineDto | unknown, // TODO: remove this unknown ??
        public _id?: ObjectId,
    ) {}
}
