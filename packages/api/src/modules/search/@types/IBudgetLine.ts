import { Siret } from "../../../@types";

export default interface IBudgetLine {
    siret: Siret,
    ej: string,
    amount: number,
    dateOperation: Date
}