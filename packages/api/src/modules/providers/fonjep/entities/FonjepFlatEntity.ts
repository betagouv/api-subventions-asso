import { ApplicationFlatEntity } from "../../../../entities/flats/ApplicationFlatEntity";
import PaymentFlatEntity from "../../../../entities/flats/PaymentFlatEntity";
import { NOT_APPLICABLE } from "dto";

export type FonjepPaymentFlatEntity = PaymentFlatEntity & {
    ej: NOT_APPLICABLE;
    financialCenterCode: NOT_APPLICABLE;
    financialCenterLabel: NOT_APPLICABLE;
    accountingAttachment: NOT_APPLICABLE;
    accountingAttachmentRegion: NOT_APPLICABLE;
};

export type FonjepApplicationFlatEntity = ApplicationFlatEntity & { totalAmount: null | number };
