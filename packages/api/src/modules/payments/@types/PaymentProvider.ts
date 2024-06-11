import { Payment, Siren, Siret } from "dto";
import Provider from "../../providers/@types/IProvider";

export default interface PaymentProvider extends Provider {
    isPaymentProvider: boolean;

    getPaymentsByKey(key: string): Promise<Payment[]>;
    getPaymentsBySiret(siret: Siret): Promise<Payment[]>;
    getPaymentsBySiren(siren: Siren): Promise<Payment[]>;
}
