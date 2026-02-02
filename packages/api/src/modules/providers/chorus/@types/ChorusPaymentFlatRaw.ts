import PaymentFlatEntity from "../../../../entities/flats/PaymentFlatEntity";

// PaymentFlatEntity field directly extracted from ChorusLineDto
export type ChorusPaymentFlatRaw = Pick<
    PaymentFlatEntity,
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
