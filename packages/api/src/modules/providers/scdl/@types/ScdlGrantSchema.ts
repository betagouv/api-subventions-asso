import { ParserInfo, ParserPath } from "../../../../@types";

export type ScdlGrantSchema = {
    allocatorName: ParserPath | ParserInfo;
    allocatorSiret: ParserPath | ParserInfo;
    conventionDate?: ParserPath | ParserInfo;
    decisionReference?: ParserPath | ParserInfo;
    associationName?: ParserPath | ParserInfo;
    associationSiret: ParserPath | ParserInfo;
    object?: ParserPath | ParserInfo;
    amount: ParserPath | ParserInfo;
    paymentConditions?: ParserPath | ParserInfo;
    paymentStartDate?: ParserPath | ParserInfo;
    paymentEndDate?: ParserPath | ParserInfo;
    idRAE?: ParserPath | ParserInfo;
    UeNotification?: ParserPath | ParserInfo;
    grantPercentage?: ParserPath | ParserInfo;
};
