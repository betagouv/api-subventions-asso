import PaymentFlatEntity from "../../../../entities/flats/PaymentFlatEntity";

// PaymentFlatEntity field directly extracted from ChorusLineDto
export type ChorusPaymentFlatRaw = Pick<
    ChorusPaymentFlatEntity,
    | "ej"
    | "exerciceBudgetaire"
    | "beneficiaryEstablishmentIdType"
    | "beneficiaryEstablishmentId"
    | "beneficiaryCompanyIdType"
    | "beneficiaryCompanyId"
    | "amount"
    | "operationDate"
    | "financialCenterCode"
    | "financialCenterLabel"
    | "accountingAttachment"
    | "accountingAttachmentRegion"
>;

// we override EJ as string and not nullable because when it's persisted in DB it must have EJ defined
// TODO: investiguate and update PaymentFlatEntity nullable props (to make EJ only a string and always define)
// => filter data before persisting in DB
export type ChorusPaymentFlatEntity = PaymentFlatEntity & { ej: string };
