import { Payment, PaymentFlatDto } from "dto";
import paymentFlatAdapter from "../../adapters/outputs/db/payment-flat/payment-flat.adapter";
import { RawPayment } from "../grant/@types/RawGrant";
import { ProviderEnum } from "../../@enums/ProviderEnum";
import ProviderCore from "../providers/provider.core";
import PaymentFlatEntity from "../../entities/flats/PaymentFlatEntity";
import PaymentFlatMapper from "./payment-flat.mapper";
import { StructureIdentifier } from "../../identifier-objects/@types/StructureIdentifier";
import { insertStreamByBatch } from "../../shared/helpers/MongoHelper";
import getPayments, { GetPayments } from "./use-cases/get-payments";

export class PaymentFlatService extends ProviderCore {
    constructor(private getPayments: GetPayments) {
        super({
            name: "Payment Flat",
            type: ProviderEnum.technical,
            description: "PaymentFlat",
            id: "payment-flat",
        });
    }

    /**
     * |-------------------------|
     * |     Database Part       |
     * |-------------------------|
     */

    public isCollectionInitialized() {
        return paymentFlatAdapter.hasBeenInitialized();
    }

    public upsertMany(entities: PaymentFlatEntity[]) {
        return paymentFlatAdapter.upsertMany(entities);
    }

    public rawToPayment(rawGrant: RawPayment) {
        return PaymentFlatMapper.rawToPayment(rawGrant);
    }

    async getPaiements(identifier: StructureIdentifier): Promise<Payment[]> {
        const payments = await this.getPayments.execute(identifier);
        return this.toPaymentArray(payments);
    }

    async getPaymentsDto(identifier: StructureIdentifier): Promise<PaymentFlatDto[]> {
        const payments: PaymentFlatEntity[] = await this.getPayments.execute(identifier);
        return payments.map(entity => PaymentFlatMapper.toDto(entity));
    }

    private toPaymentArray(documents: PaymentFlatEntity[]) {
        return documents.map(document => {
            return PaymentFlatMapper.toPayment(document);
        });
    }

    async getRawGrants(identifier: StructureIdentifier): Promise<RawPayment[]> {
        const entities = await this.getPayments.execute(identifier);

        return entities.map(grant => ({
            provider: "payment-flat",
            type: "payment",
            data: grant,
            joinKey: grant.paymentId ?? undefined,
        }));
    }

    saveFromStream(stream: ReadableStream<PaymentFlatEntity>) {
        return insertStreamByBatch(stream, batch => paymentFlatAdapter.upsertMany(batch), 10000);
    }
}

const paymentFlatService = new PaymentFlatService(getPayments);

export default paymentFlatService;
