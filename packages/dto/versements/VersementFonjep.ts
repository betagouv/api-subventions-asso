import { ProviderValue } from "../shared/ProviderValue";
import { Versement } from "./Versement";

export interface VersementFonjep extends Versement {
    periodeDebut: ProviderValue<Date>,
    periodeFin: ProviderValue<Date>,
    montantAPayer: ProviderValue<number>
}