import { Payment, Siren, Siret } from "dto";
import { RawPayment } from "../../grant/@types/rawGrant";
import GrantProvider from "../../grant/@types/GrantProvider";

export default interface PaymentProvider<T> extends GrantProvider {
    isPaymentProvider: boolean;

    rawToPayment: (rawPayment: RawPayment<T>) => Payment;

    getPaymentsByKey(key: string): Promise<Payment[]>;
    getPaymentsBySiret(siret: Siret): Promise<Payment[]>;
    getPaymentsBySiren(siren: Siren): Promise<Payment[]>;
}
