import IBudgetLine from "../../../search/@types/IBudgetLine";

export default interface IChorusIndexedInformations extends IBudgetLine {
    compte: string,
    codeBranche: string,
    typeOperation: string,
}