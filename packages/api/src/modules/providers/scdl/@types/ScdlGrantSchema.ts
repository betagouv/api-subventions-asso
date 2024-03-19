import { ParserScheme } from "../../../../@types";

/**
 * Schema has allocatorName and allocatorSiret missing from SCDL fromat
 * This is a choise we made because we wanted to fill it manually from CLI addProducer
 */

export type ScdlGrantSchema = {
    conventionDate?: ParserScheme;
    decisionReference?: ParserScheme;
    associationName?: ParserScheme;
    associationSiret: ParserScheme;
    associationRna?: ParserScheme;
    object?: ParserScheme;
    amount: ParserScheme;
    paymentNature: ParserScheme;
    paymentConditions?: ParserScheme;
    paymentStartDate?: ParserScheme;
    paymentEndDate?: ParserScheme;
    idRAE?: ParserScheme;
    UeNotification?: ParserScheme;
    grantPercentage?: ParserScheme;
    aidSystem: ParserScheme;
};
