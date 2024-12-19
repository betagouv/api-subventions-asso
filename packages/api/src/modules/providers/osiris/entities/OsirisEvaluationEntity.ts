import { ObjectId } from "mongodb";
import { ParserInfo, ParserPath } from "../../../../@types";
import IOsirisEvaluationsInformations from "../@types/IOsirisEvaluationsInformations";

export default class OsirisEvaluationEntity {
    public static defaultMainCategory = "Dossier/action";

    public static indexedInformationsPath: {
        [key: string]: ParserPath | ParserInfo<string | number>;
    } = {
        osirisActionId: [OsirisEvaluationEntity.defaultMainCategory, "Numero Action Osiris"],
        exercise: [OsirisEvaluationEntity.defaultMainCategory, "Exercice budgetaire"],
        siret: {
            path: ["Bénéficiaire", "N° Siret"],
            adapter: value => {
                return String(value);
            },
        },
        evaluation_resultat: ["Evaluation", "Objectifs atteints au regard des indicateurs"],
        cout_total_realise: {
            path: ["Montants et versements", "Coût réalisé (total charges)"],
            adapter: value => {
                if (!value || typeof value === "number") return value;
                return parseFloat(value);
            },
        },
    };

    constructor(
        public indexedInformations: IOsirisEvaluationsInformations,
        public data: unknown,
        public _id?: ObjectId,
    ) {}
}
