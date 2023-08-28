import { Siret } from "dto";
import { ObjectId } from "mongodb";

export type ScdlGrantDbo = {
    // in English as it is internal code
    _id: ObjectId;
    allocatorName: string;
    allocatorSiret: string;
    conventionDate: Date;
    decisionReference: string;
    associationName: string;
    associationSiret: Siret;
    object: string;
    amount: number; // granted amount
    paymentConditions: string;
    paymentStartDate: Date;
    paymentEndDate: Date;
    idRAE?: string;
    UeNotification: boolean;
    grantPercentage: number;
    extractId: ObjectId;
};
