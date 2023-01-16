import { Siret } from "@api-subventions-asso/dto";

export default interface IBudgetLine {
    siret: Siret;
    ej: string;
    amount: number;
    dateOperation: Date;
}
