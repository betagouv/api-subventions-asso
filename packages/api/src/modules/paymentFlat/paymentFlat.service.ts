import { Payment, PaymentFlatDto } from "dto";
import paymentFlatPort from "../../dataProviders/db/paymentFlat/paymentFlat.port";
import PaymentProvider from "../payments/@types/PaymentProvider";
import AssociationIdentifier from "../../identifierObjects/AssociationIdentifier";
import EstablishmentIdentifier from "../../identifierObjects/EstablishmentIdentifier";
import { RawGrant, RawPayment } from "../grant/@types/rawGrant";
import { ProviderEnum } from "../../@enums/ProviderEnum";
import ProviderCore from "../providers/ProviderCore";
import PaymentFlatEntity from "../../entities/PaymentFlatEntity";
import PaymentFlatAdapter from "./paymentFlatAdapter";
import { StructureIdentifier } from "../../identifierObjects/@types/StructureIdentifier";

export class PaymentFlatService extends ProviderCore implements PaymentProvider<PaymentFlatEntity> {
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

    public rawToPayment(rawGrant: RawPayment<PaymentFlatEntity>) {
        return PaymentFlatAdapter.rawToPayment(rawGrant);
    }

    async getPaymentFlat(identifier: StructureIdentifier): Promise<PaymentFlatEntity[]> {
        const payments: PaymentFlatEntity[] = [];

        if (identifier instanceof EstablishmentIdentifier && identifier.siret) {
            payments.push(...(await paymentFlatPort.findBySiret(identifier.siret)));
        } else if (identifier instanceof AssociationIdentifier && identifier.siren) {
            payments.push(...(await paymentFlatPort.findBySiren(identifier.siren)));
        }
        return payments;
    }

    async getPayments(identifier: StructureIdentifier): Promise<Payment[]> {
        const payments = await this.getPaymentFlat(identifier);
        return this.toPaymentArray(payments);
    }

    async getPaymentsDto(identifier: StructureIdentifier): Promise<PaymentFlatDto[]> {
        const payments: PaymentFlatEntity[] = await this.getPaymentFlat(identifier);
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

    async getRawGrants(_identifier: StructureIdentifier): Promise<RawGrant[]> {
        return [];

        // TODO: uncomment this when all other providers will be deconnected from grant
        // TODO: or remove this if grant process is not needed anymore
        // let dbos: PaymentFlatEntity[] = [];
        // if (identifier instanceof EstablishmentIdentifier && identifier.siret) {
        //     dbos = await paymentFlatPort.findBySiret(identifier.siret);
        // } else if (identifier instanceof AssociationIdentifier && identifier.siren) {
        //     dbos = await paymentFlatPort.findBySiren(identifier.siren);
        // }

        // return dbos.map(grant => ({
        //     provider: "payment-flat",
        //     type: "payment",
        //     data: grant,
        //     /* Pour l'instant on garde ej pour tous les providers sauf Fonjep qui prend idVersement
        //     Il faudra convertir tous les versementKey en idVersement quand tout est connecté  */
        //     joinKey: grant.provider === "fonjep" ? grant.idVersement : grant.ej || undefined,
        // }));
    }
}

const paymentFlatService = new PaymentFlatService();

export default paymentFlatService;
