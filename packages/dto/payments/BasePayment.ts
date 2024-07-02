import { ProviderValue } from "../shared/ProviderValue";
import { Siret } from "../shared/Siret";

export interface BasePayment {
    versementKey: ProviderValue<string>;
    siret: ProviderValue<Siret>;
    amount: ProviderValue<number>;
    dateOperation: ProviderValue<Date>;
    programme: ProviderValue<number>;
    libelleProgramme: ProviderValue<string>;
}
