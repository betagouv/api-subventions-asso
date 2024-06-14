import { ProviderValue } from "../shared/ProviderValue";
import { BasePayment } from "./BasePayment";

export interface FonjepPayment extends BasePayment {
    periodeDebut: ProviderValue<Date>;
    periodeFin: ProviderValue<Date>;
    montantAPayer: ProviderValue<number>;
    /**
     * Deprecated
     */
    bop: ProviderValue<number>;
}
