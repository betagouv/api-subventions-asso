import PaymentFlatEntity from "../../../../entities/PaymentFlatEntity";

// PaymentFlatEntity field directly extracted from ChorusLineDto
export type ChorusPaymentFlatRaw = Pick<
    ChorusPaymentFlatEntity,
    | "ej"
    | "exerciceBudgetaire"
    | "typeIdEtablissementBeneficiaire"
    | "idEtablissementBeneficiaire"
    | "typeIdEntrepriseBeneficiaire"
    | "idEntrepriseBeneficiaire"
    | "amount"
    | "operationDate"
    | "centreFinancierCode"
    | "centreFinancierLibelle"
    | "attachementComptable"
>;

// TODO: remove both codePoste and EJ from PaymentFlat ?
export type ChorusPaymentFlatEntity = PaymentFlatEntity & { ej: string; codePoste: null };
