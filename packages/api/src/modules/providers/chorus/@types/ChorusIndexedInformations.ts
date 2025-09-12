import type BudgetLine from "../../../search/@types/BudgetLine";

export default interface ChorusIndexedInformations extends BudgetLine {
    numPosteEJ: number;
    codeBranche: string;
    branche: string;
    // reponsable du paiement d'un ou plusieurs programmes (bop)
    centreFinancier: string;
    codeCentreFinancier: string;
    domaineFonctionnel: string;
    // format bop - activité - sous-activité
    codeDomaineFonctionnel: string;
    numeroDemandePaiement: string;
    // numéro de poste de demande de paiment
    numPosteDP: number;
    codeSociete: string;
    exercice: number;
    numeroTier?: string;
    activitee?: string;
    codeActivitee?: string;
    typeOperation?: string;
    compte?: string;
}
