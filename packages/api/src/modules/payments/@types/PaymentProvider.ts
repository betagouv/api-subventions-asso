import type { Payment } from "dto";
import type { RawPayment } from "../../grant/@types/rawGrant";
import type GrantProvider from "../../grant/@types/GrantProvider";
import type { StructureIdentifier } from "../../../identifierObjects/@types/StructureIdentifier";
import type PaymentFlatEntity from "../../../entities/flats/PaymentFlatEntity";

export default interface PaymentProvider extends GrantProvider {
    isPaymentProvider: boolean;

    rawToPayment: (rawPayment: RawPayment) => Payment;

    getPayments(identifier: StructureIdentifier): Promise<Payment[]>;

    saveFromStream(stream: ReadableStream<PaymentFlatEntity>): void;
}
