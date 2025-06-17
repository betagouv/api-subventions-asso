import { Payment } from "dto";
import { RawPayment } from "../../grant/@types/rawGrant";
import GrantProvider from "../../grant/@types/GrantProvider";
import { StructureIdentifier } from "../../../valueObjects/@types/StructureIdentifier";

export default interface PaymentProvider<T> extends GrantProvider {
    isPaymentProvider: boolean;

    rawToPayment: (rawPayment: RawPayment<T>) => Payment;

    getPayments(identifier: StructureIdentifier): Promise<Payment[]>;
    getPaymentsByKey(key: string): Promise<Payment[]>;
}
