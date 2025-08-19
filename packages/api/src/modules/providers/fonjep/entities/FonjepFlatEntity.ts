import { ApplicationFlatEntity } from "../../../../entities/ApplicationFlatEntity";
import PaymentFlatEntity from "../../../../entities/PaymentFlatEntity";
import { NOT_APPLICABLE } from "../../../../shared/GenericAdapter";

export type FonjepPaymentFlatEntity = PaymentFlatEntity & {
    ej: NOT_APPLICABLE;
    centreFinancierCode: NOT_APPLICABLE;
    centreFinancierLibelle: NOT_APPLICABLE;
    attachementComptable: NOT_APPLICABLE;
    regionAttachementComptable: NOT_APPLICABLE;
};

export type FonjepApplicationFlatEntity = ApplicationFlatEntity & { totalAmount: null | number };
