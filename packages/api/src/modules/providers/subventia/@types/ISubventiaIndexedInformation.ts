export default interface ISubventiaIndexedInformation {
    initule: string;
    description: string;
    exerciceBudgetaire: number;
    budgetGlobal: number;
    montantSollicite?: number;
    decision?: string;
    dateDecision?: string;
    financeurs: string;
    status: string;
}
