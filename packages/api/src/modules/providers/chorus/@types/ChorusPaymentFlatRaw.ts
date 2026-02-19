import PaymentFlatEntity from "../../../../entities/flats/PaymentFlatEntity";

// PaymentFlatEntity field directly extracted from ChorusLineDto
export type ChorusPaymentFlatRaw = Pick<
    PaymentFlatEntity,
    | "ej"
    | "budgetaryYear"
    | "beneficiaryEstablishmentIdType"
    | "beneficiaryEstablishmentId"
    | "beneficiaryCompanyIdType"
    | "beneficiaryCompanyId"
    | "amount"
    | "operationDate"
    | "financialCenterCode"
    | "financialCenterLabel"
    | "accountingAttachment"
>;
