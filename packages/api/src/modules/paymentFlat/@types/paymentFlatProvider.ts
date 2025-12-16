import type PaymentFlatEntity from "../../../entities/PaymentFlatEntity";

export default interface PaymentFlatProvider {
    savePaymentsFromStream(stream: ReadableStream<PaymentFlatEntity>): void;
}
