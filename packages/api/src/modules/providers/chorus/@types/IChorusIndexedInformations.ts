import IBudgetLine from "../../../search/@types/IBudgetLine";

export default interface IChorusIndexedInformations extends IBudgetLine {
    codeBranche: string;
    branche: string;
    centreFinancier: string;
    codeCentreFinancier: string;
    domaineFonctionnel: string;
    codeDomaineFonctionnel: string;
    numeroDemandePayment: string;
    numeroTier?: string;
    activitee?: string;
    codeActivitee?: string;
    typeOperation?: string;
    compte?: string;
}
