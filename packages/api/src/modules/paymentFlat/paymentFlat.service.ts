import { Payment, PaymentFlatDto } from "dto";
import paymentFlatPort from "../../dataProviders/db/paymentFlat/paymentFlat.port";
import PaymentProvider from "../payments/@types/PaymentProvider";
import AssociationIdentifier from "../../identifierObjects/AssociationIdentifier";
import EstablishmentIdentifier from "../../identifierObjects/EstablishmentIdentifier";
import { RawPayment } from "../grant/@types/rawGrant";
import { ProviderEnum } from "../../@enums/ProviderEnum";
import ProviderCore from "../providers/ProviderCore";
import PaymentFlatEntity from "../../entities/flats/PaymentFlatEntity";
import PaymentFlatAdapter from "./paymentFlatAdapter";
import { StructureIdentifier } from "../../identifierObjects/@types/StructureIdentifier";
import GrantProvider from "../grant/@types/GrantProvider";
import { StructureProvider } from "../StructureProvider";
import { insertStreamByBatch } from "../../shared/helpers/MongoHelper";

export class PaymentFlatService extends ProviderCore implements PaymentProvider, GrantProvider, StructureProvider {
    constructor() {
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
        return paymentFlatPort.hasBeenInitialized();
    }

    public upsertMany(entities: PaymentFlatEntity[]) {
        return paymentFlatPort.upsertMany(entities);
    }

    /**
     * |--------------------------|
     * |   Payment Provider Part  |
     * |--------------------------|
     */

    isPaymentProvider = true;

    public rawToPayment(rawGrant: RawPayment) {
        return PaymentFlatAdapter.rawToPayment(rawGrant);
    }

    async getEntitiesByIdentifier(identifier: StructureIdentifier): Promise<PaymentFlatEntity[]> {
        const payments: PaymentFlatEntity[] = [];

        if (identifier instanceof EstablishmentIdentifier && identifier.siret) {
            payments.push(...(await paymentFlatPort.findBySiret(identifier.siret)));
        } else if (identifier instanceof AssociationIdentifier && identifier.siren) {
            payments.push(...(await paymentFlatPort.findBySiren(identifier.siren)));
        }
        return payments;
    }

    async getPayments(identifier: StructureIdentifier): Promise<Payment[]> {
        const payments = await this.getEntitiesByIdentifier(identifier);
        return this.toPaymentArray(payments);
    }

    async getPaymentsDto(identifier: StructureIdentifier): Promise<PaymentFlatDto[]> {
        const payments: PaymentFlatEntity[] = await this.getEntitiesByIdentifier(identifier);
        return payments.map(entity => PaymentFlatAdapter.toDto(entity));
    }

    private toPaymentArray(documents: PaymentFlatEntity[]) {
        return documents.map(document => {
            return PaymentFlatAdapter.toPayment(document);
        });
    }

    /**
     * |-------------------------|
     * |   Grant Provider Part   |
     * |-------------------------|
     */

    isGrantProvider = true;

    async getRawGrants(identifier: StructureIdentifier): Promise<RawPayment[]> {
        let entities: PaymentFlatEntity[] = [];
        if (identifier instanceof EstablishmentIdentifier && identifier.siret) {
            entities = await paymentFlatPort.findBySiret(identifier.siret);
        } else if (identifier instanceof AssociationIdentifier && identifier.siren) {
            entities = await paymentFlatPort.findBySiren(identifier.siren);
        }

        return entities.map(grant => ({
            provider: "payment-flat",
            type: "payment",
            data: grant,
            joinKey: grant.paymentId ?? undefined,
        }));
    }

    saveFromStream(stream: ReadableStream<PaymentFlatEntity>) {
        return insertStreamByBatch(stream, batch => paymentFlatPort.upsertMany(batch), 10000);
    }
}

const paymentFlatService = new PaymentFlatService();

export default paymentFlatService;
