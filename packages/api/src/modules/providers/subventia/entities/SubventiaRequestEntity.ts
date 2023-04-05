import { ParserInfo, ParserPath, DefaultObject } from "../../../../@types";
import ILegalInformations from "../../../search/@types/ILegalInformations";
import ISubventiaIndexedInformation from "../@types/ISubventiaIndexedInformation";

export class SubventiaRequestEntity {
    public static indexedLegalInformationsPath: DefaultObject<ParserPath | ParserInfo> = {
        siret: ["SIRET - Bénéficiaire"],
        name: ["Demandeur"],
    };

    public static indexedProviderInformationsPath: DefaultObject<ParserPath | ParserInfo> = {
        initule: ["Intitule de l'action"],
        description: ["Description"],
        exerciceBudgetaire: ["Exercice budgétaire - Demande"],
        budgetGlobal: ["Budget global"],
        montantSollicite: {
            path: ["Montant sollicité"],
            adapter: value => {
                if (!value || (typeof value == "string" && value.length === 0)) return undefined;
                return value;
            },
        },
        decision: {
            path: ["Décision"],
            adapter: value => {
                if (!value || value.length === 0) return undefined;
                return value;
            },
        },
        dateDecision: {
            path: ["Date - Décision"],
            adapter: value => {
                if (!value || value.length === 0) return undefined;
                return value;
            },
        },
        financeurs: ["Financeurs (subventions d'exploitation)"],
        status: ["Statut libellé - Demande"],
    };

    constructor(
        public legalInformations: ILegalInformations,
        public indexedInformations: ISubventiaIndexedInformation,
        public data: unknown,
    ) {}
}
