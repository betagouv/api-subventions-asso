import { ParserScheme } from "../../../../@types";

export type ScdlGrantSchema = {
    allocatorName: ParserScheme;
    allocatorSiret: ParserScheme;
    exercice: ParserScheme;
    conventionDate: ParserScheme;
    decisionReference: ParserScheme;
    associationName: ParserScheme;
    associationSiret: ParserScheme;
    associationRna: ParserScheme;
    object: ParserScheme;
    amount: ParserScheme;
    paymentNature: ParserScheme;
    paymentConditions: ParserScheme;
    paymentStartDate: ParserScheme;
    paymentEndDate: ParserScheme;
    idRAE: ParserScheme;
    UeNotification: ParserScheme;
    grantPercentage: ParserScheme;
    aidSystem: ParserScheme;
};
