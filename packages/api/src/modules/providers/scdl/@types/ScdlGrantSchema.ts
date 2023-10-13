import { ParserScheme } from "../../../../@types";

export type ScdlGrantSchema = {
    allocatorName: ParserScheme;
    allocatorSiret: ParserScheme;
    conventionDate?: ParserScheme;
    decisionReference?: ParserScheme;
    associationName?: ParserScheme;
    associationSiret: ParserScheme;
    object?: ParserScheme;
    amount: ParserScheme;
    paymentConditions?: ParserScheme;
    paymentStartDate?: ParserScheme;
    paymentEndDate?: ParserScheme;
    idRAE?: ParserScheme;
    UeNotification?: ParserScheme;
    grantPercentage?: ParserScheme;
};
