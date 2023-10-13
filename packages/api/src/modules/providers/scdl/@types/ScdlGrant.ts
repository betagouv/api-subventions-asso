import { Siret } from "dto";

export type ScdlGrant = {
    allocatorName: string;
    allocatorSiret: Siret;
    conventionDate?: Date;
    decisionReference?: string;
    associationName?: string;
    associationSiret: string;
    object?: string;
    amount: number;
    paymentConditions?: string;
    paymentStartDate?: string;
    paymentEndDate?: string;
    idRAE?: string;
    UeNotification?: boolean;
    grantPercentage?: number;
};
