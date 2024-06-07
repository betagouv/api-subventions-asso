import { ProviderValue } from "../shared/ProviderValue";
import { BasePayment } from "./BasePayment";

export interface PaymentFonjep extends BasePayment {
    periodeDebut: ProviderValue<Date>;
    periodeFin: ProviderValue<Date>;
    montantAPayer: ProviderValue<number>;
    bop: ProviderValue<number>;
}
