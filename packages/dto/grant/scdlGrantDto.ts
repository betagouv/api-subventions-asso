import { Rna } from "../build";
import { Siret } from "../shared/Siret";

enum PaymentNatureEnum {
    "aide en numéraire",
    "aide en nature",
    "aide en numéraire;aide en nature",
    "aide en nature;aide en numéraire",
}

export type ScdlGrantDto = {
    id: string; // ObjectId.toString()
    allocatorName: string;
    allocatorSiret: string;
    conventionDate: string; // date formatted as YYYY-MM-DD
    decisionReference: string;
    associationName: string;
    associationSiret: Siret;
    associationRna: Rna;
    object: string;
    amount: number;
    paymentNature: PaymentNatureEnum;
    paymentConditions: "unique" | "échelonné" | "autre";
    paymentStartDate: Date; // date formatted as YYYY-MM-DD
    paymentEndDate: Date | null; // date formatted as YYYY-MM-DD
    idRAE?: string;
    UeNotification: boolean;
    grantPercentage: number;
    aidSystem: string;
};
