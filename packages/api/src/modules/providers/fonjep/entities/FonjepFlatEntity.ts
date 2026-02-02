import { ApplicationFlatEntity } from "../../../../entities/flats/ApplicationFlatEntity";
import PaymentFlatEntity from "../../../../entities/flats/PaymentFlatEntity";
import { NOT_APPLICABLE } from "dto";

export type FonjepPaymentFlatEntity = PaymentFlatEntity & {
    ej: NOT_APPLICABLE;
    centreFinancierCode: NOT_APPLICABLE;
    centreFinancierLibelle: NOT_APPLICABLE;
    attachementComptable: NOT_APPLICABLE;
    regionAttachementComptable: NOT_APPLICABLE;
};

export type FonjepApplicationFlatEntity = ApplicationFlatEntity & { totalAmount: null | number };
