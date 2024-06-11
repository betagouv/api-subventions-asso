import { Payment, Siren, Siret } from "dto";
import Provider from "../../providers/@types/IProvider";
import { RawPayment } from "../../grant/@types/rawGrant";

export default interface PaymentProvider<T> extends Provider {
    isPaymentProvider: boolean;

    rawToPayment: (rawPayment: RawPayment<T>) => Payment;

    getPaymentsByKey(key: string): Promise<Payment[]>;
    getPaymentsBySiret(siret: Siret): Promise<Payment[]>;
    getPaymentsBySiren(siren: Siren): Promise<Payment[]>;
}
