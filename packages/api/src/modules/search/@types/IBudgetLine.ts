import { Siret } from "dto";

export default interface IBudgetLine {
    siret: Siret;
    ej: string;
    amount: number;
    dateOperation: Date;
}
