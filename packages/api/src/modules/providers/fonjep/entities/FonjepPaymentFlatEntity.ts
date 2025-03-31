import PaymentFlatEntity from "../../../../entities/PaymentFlatEntity";
import { NOT_APPLICABLE } from "../../../../shared/GenericAdapter";

export type FonjepPaymentFlatEntity = PaymentFlatEntity & { codePoste: string; ej: NOT_APPLICABLE };
