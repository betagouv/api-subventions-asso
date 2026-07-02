import paymentFlatAdapter from "../../../adapters/outputs/db/payment-flat/payment-flat.adapter";
import { PaymentFlatPort } from "../../../adapters/outputs/db/payment-flat/payment-flat.port";
import PaymentFlatEntity from "../../../entities/flats/PaymentFlatEntity";
import { AssociationIdentifier } from "../../../identifier-objects";

export class GetAssociationPayments {
    constructor(private port: PaymentFlatPort) {}

    execute(identifier: AssociationIdentifier) {
        if (!identifier.siren) return Promise.resolve([]) as Promise<PaymentFlatEntity[]>;
        return this.port.findBySiren(identifier.siren);
    }
}

const getAssociationPayments = new GetAssociationPayments(paymentFlatAdapter);
export default getAssociationPayments;
