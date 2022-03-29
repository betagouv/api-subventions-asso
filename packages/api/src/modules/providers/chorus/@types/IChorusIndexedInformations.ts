import IBudgetLine from "../../../search/@types/IBudgetLine";

export default interface IChorusIndexedInformations extends IBudgetLine {
    codeBranche: string,
    branche: string,
    centreFinancier: string
    codeCentreFinancier: string,
    domaineFonctionnel: string,
    codeDomaineFonctionnel: string,
    typeOperation?: string,
    compte?: string,
}