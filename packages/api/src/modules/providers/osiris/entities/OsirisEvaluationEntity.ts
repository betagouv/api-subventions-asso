import { ObjectId } from "mongodb";
import { ParserInfo, ParserPath } from "../../../../@types";
import IOsirisEvaluationsInformations from "../@types/IOsirisEvaluationsInformations";

export default class OsirisEvaluationEntity {
    public static defaultMainCategory = "Dossier/action";

    public static indexedInformationsPath: {
        [key: string]: ParserPath | ParserInfo;
    } = {
        osirisActionId: [OsirisEvaluationEntity.defaultMainCategory, "Numero Action Osiris"],
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
                if (!value) return value;
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
