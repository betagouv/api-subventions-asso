import { Payment } from "dto";
import paymentFlatPort from "../../dataProviders/db/paymentFlat/paymentFlat.port";
import PaymentFlatEntity from "../../entities/PaymentFlatEntity";
import PaymentProvider from "../payments/@types/PaymentProvider";
import AssociationIdentifier from "../../valueObjects/AssociationIdentifier";
import EstablishmentIdentifier from "../../valueObjects/EstablishmentIdentifier";
import { StructureIdentifier } from "../../@types";
import { RawGrant, RawPayment } from "../grant/@types/rawGrant";
import { ProviderEnum } from "../../@enums/ProviderEnum";
import ProviderCore from "../providers/ProviderCore";
import PaymentFlatAdapter from "./paymentFlatAdapter";

export class PaymentFlatService extends ProviderCore implements PaymentProvider<PaymentFlatEntity> {
    constructor() {
        super({
            name: "Payment Flat",
            type: ProviderEnum.raw,
            description: "PaymentFlat",
            id: "payment-flat",
        });
    }

    public isCollectionInitialized() {
        return paymentFlatPort.hasBeenInitialized();
    }

    /**
     * |-------------------------|
     * |     Payment Part        |
     * |-------------------------|
     */

    isPaymentProvider = true;

    public rawToPayment(rawGrant: RawPayment<PaymentFlatEntity>) {
        return PaymentFlatAdapter.rawToPayment(rawGrant);
    }

    async getPayments(identifier: StructureIdentifier): Promise<Payment[]> {
        const requests: PaymentFlatEntity[] = [];

        if (identifier instanceof EstablishmentIdentifier && identifier.siret) {
            requests.push(...(await paymentFlatPort.findBySiret(identifier.siret)));
        } else if (identifier instanceof AssociationIdentifier && identifier.siren) {
            requests.push(...(await paymentFlatPort.findBySiren(identifier.siren)));
        }
        return this.toPaymentArray(requests);
    }

    async getPaymentsByKey(ej: string) {
        const requests = await paymentFlatPort.findByEJ(ej);
        return this.toPaymentArray(requests);
    }

    private toPaymentArray(documents: PaymentFlatEntity[]) {
        return documents.map(document => {
            return PaymentFlatAdapter.toPayment(document);
        });
    }

    /**
     * |-------------------------|
     * |   Grant Part            |
     * |-------------------------|
     */

    isGrantProvider = true;

    async getRawGrants(identifier: StructureIdentifier): Promise<RawGrant[]> {
        let dbos: PaymentFlatEntity[] = [];
        if (identifier instanceof EstablishmentIdentifier && identifier.siret) {
            dbos = await paymentFlatPort.findBySiret(identifier.siret);
        } else if (identifier instanceof AssociationIdentifier && identifier.siren) {
            dbos = await paymentFlatPort.findBySiren(identifier.siren);
        }

        /* Pour l'instant on garde ej pour tous les providers sauf Fonjep qui prend idVersement 
        Il faudra convertir tous les versementKey en idVersement quand tout est connecté  */
        return dbos.map(grant => ({
            provider: grant.provider,
            type: "payment",
            data: grant,
            joinKey: grant.provider === "fonjep" ? grant.idVersement : grant.ej,
        }));
    }
}

const paymentFlatService = new PaymentFlatService();

export default paymentFlatService;
