import PaymentFlatEntity from "../../../../entities/flats/PaymentFlatEntity";

// PaymentFlatEntity field directly extracted from ChorusLineDto
export type ChorusPaymentFlatRaw = Pick<
    PaymentFlatEntity,
    | "ej"
    | "exerciceBudgetaire"
    | "beneficiaryEstablishmentIdType"
    | "beneficiaryEstablishmentId"
    | "beneficiaryCompanyIdType"
    | "beneficiaryCompanyId"
    | "amount"
    | "operationDate"
    | "centreFinancierCode"
    | "centreFinancierLibelle"
    | "attachementComptable"
>;
