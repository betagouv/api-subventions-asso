import { ObjectId } from "mongodb";
import { ParserInfo } from "../../../../@types";
import type ChorusIndexedInformations from "../@types/ChorusIndexedInformations";
import { GenericParser } from "../../../../shared/GenericParser";
import { ChorusLineDto } from "../@types/ChorusLineDto";
import { santitizeFloat } from "../../../../shared/helpers/NumberHelper";

export default class ChorusLineEntity {
    public provider = "Chorus";

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
            adapter: santitizeFloat,
        },
        numeroTier: { path: ["Fournisseur payé (DP)"] },
        // TODO: rajouter le nom de la structure (path: ["Nom de la structure"])
        // anciennement ["Fournisseur payé (DP) CODE"] mais le nom n'était pas bon et pas utilisé
        centreFinancier: { path: ["Centre financier"] },
        codeCentreFinancier: { path: ["Centre financier CODE"] },
        domaineFonctionnel: { path: ["Domaine fonctionnel"] },
        codeDomaineFonctionnel: { path: ["Domaine fonctionnel CODE"] },
        amount: {
            path: [["EUR", "Montant payé"]],
            adapter: santitizeFloat,
        },
        dateOperation: {
            path: ["Date de dernière opération sur la DP"],
            adapter: GenericParser.getDateFromXLSX,
        },
    };

    constructor(
        public uniqueId: string,
        public updateDate: Date,
        public indexedInformations: ChorusIndexedInformations,
        public data: ChorusLineDto | unknown, // TODO: remove this unknown ??
        public _id?: ObjectId,
    ) {}
}
