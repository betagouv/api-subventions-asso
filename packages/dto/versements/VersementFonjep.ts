import { ProviderValue } from "../shared/ProviderValue";
import { BaseVersement } from "./BaseVersement";

export interface VersementFonjep extends BaseVersement {
    periodeDebut: ProviderValue<Date>,
    periodeFin: ProviderValue<Date>,
    montantAPayer: ProviderValue<number>
}