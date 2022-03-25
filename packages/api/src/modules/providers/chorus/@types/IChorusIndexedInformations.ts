import IBudgetLine from "../../../search/@types/IBudgetLine";

export default interface IChorusIndexedInformations extends IBudgetLine {
    compte?: string,
    codeBranche: string,
    branche: string,
    typeOperation?: string,
}