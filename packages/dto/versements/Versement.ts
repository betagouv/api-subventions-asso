import { ProviderValue } from "../shared/ProviderValue";
import { Siret } from "../shared/Siret";

export interface Versement {
    id: string,
    ej?: ProviderValue<string>;
    codePoste?: ProviderValue<string>;
    siret: ProviderValue<Siret>;
    amount: ProviderValue<number>;
    dateOperation: ProviderValue<Date>;
}