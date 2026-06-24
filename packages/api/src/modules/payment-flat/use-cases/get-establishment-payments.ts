import paymentFlatAdapter from "../../../adapters/outputs/db/payment-flat/payment-flat.adapter";
import { PaymentFlatPort } from "../../../adapters/outputs/db/payment-flat/payment-flat.port";
import PaymentFlatEntity from "../../../entities/flats/PaymentFlatEntity";
import { EstablishmentIdentifier } from "../../../identifier-objects";

export class GetEstablishmentPayments {
    constructor(private port: PaymentFlatPort) {}

    execute(identifier: EstablishmentIdentifier) {
        if (!identifier.siret) return Promise.resolve([]) as Promise<PaymentFlatEntity[]>;
        return this.port.findBySiret(identifier.siret);
    }
}

const getEstablishmentPayments = new GetEstablishmentPayments(paymentFlatAdapter);
export default getEstablishmentPayments;
