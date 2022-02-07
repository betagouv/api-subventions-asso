import { Siret } from "../../../@types/Siret";

export default interface IBudgetLine {
    siret: Siret,
    ej: string,
    amount: number,
    dateOperation: Date
}