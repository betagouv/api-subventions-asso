import { Payment } from "dto";
import { RawPayment } from "../../grant/@types/rawGrant";
import GrantProvider from "../../grant/@types/GrantProvider";
import { StructureIdentifier } from "../../../identifierObjects/@types/StructureIdentifier";

export default interface PaymentProvider extends GrantProvider {
    isPaymentProvider: boolean;

    rawToPayment: (rawPayment: RawPayment) => Payment;

    getPayments(identifier: StructureIdentifier): Promise<Payment[]>;
}
