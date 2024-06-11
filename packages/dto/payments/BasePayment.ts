import { ProviderValue } from "../shared/ProviderValue";
import { Siret } from "../shared/Siret";

export interface BasePayment {
    id: string;
    ej?: ProviderValue<string>;
    versementKey: ProviderValue<string>;
    codePoste?: ProviderValue<string>;
    siret: ProviderValue<Siret>;
    amount: ProviderValue<number>;
    dateOperation: ProviderValue<Date>;
}
