import paymentFlatAdapter from "../../adapters/outputs/db/payment-flat/payment-flat.adapter";
import PaymentFlatEntity from "../../entities/flats/PaymentFlatEntity";
import { ChorusPaymentFlatEntity } from "../providers/chorus/@types/ChorusPaymentFlat";
import PaymentFlatProvider from "./@types/paymentFlatProvider";
import paymentFlatService from "./payment-flat.service";
import { ReadableStream } from "stream/web";
import aggregateChorusPayments, { AggregateChorusPayments } from "../../usecases/chorus/aggregate-chorus-payments";

// TODO: this was only created to extract chorus dependent process from paymentFlatService
// This should be better thought and refactored
export class PaymentFlatChorusService implements PaymentFlatProvider {
    constructor(private aggregate: AggregateChorusPayments) {}

    // init chorus data in paymentFlat (all exercises since 2017)
    public async init() {
        const START_YEAR = 2017;
        const END_YEAR = new Date().getFullYear();

        for (let year = START_YEAR; year <= END_YEAR; year++) {
            console.log(`init payment flat collection for exercise ${year}`);

            const payments = await this.aggregate.execute(year);

            // if no payments for year, we move on
            // mainly used for current year if no data has been added yet
            if (payments.length === 0) continue;

            await this.addToPaymentFlat(payments);
        }
    }

    public addToPaymentFlat(payments: ChorusPaymentFlatEntity[]) {
        const stream = ReadableStream.from(payments);
        return this.savePaymentsFromStream(stream);
    }

    public async updatePaymentsFlatCollection(exerciceBudgetaire: number) {
        const payments = await this.aggregate.execute(exerciceBudgetaire);

        await this.addToPaymentFlat(payments);
    }

    public savePaymentsFromStream(stream: ReadableStream<PaymentFlatEntity>) {
        return paymentFlatService.saveFromStream(stream);
    }

    public cursorFindChorusOnly(exerciceBudgetaire?: number) {
        return paymentFlatAdapter.cursorFindChorusOnly(exerciceBudgetaire);
    }
}

const paymentFlatChorusService = new PaymentFlatChorusService(aggregateChorusPayments);
export default paymentFlatChorusService;
