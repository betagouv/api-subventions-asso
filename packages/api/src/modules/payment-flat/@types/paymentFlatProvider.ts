import { ReadableStream } from "stream/web";
import type PaymentFlatEntity from "../../../entities/flats/PaymentFlatEntity";

export default interface PaymentFlatProvider {
    savePaymentsFromStream(stream: ReadableStream<PaymentFlatEntity>): void;
}
