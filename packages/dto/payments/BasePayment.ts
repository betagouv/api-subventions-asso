import { ProviderValue } from "../shared/ProviderValue";
import { SiretDto } from "../shared/Siret";

export interface BasePayment {
    exerciceBudgetaire: ProviderValue<number>;
    versementKey: ProviderValue<string>;
    siret: ProviderValue<SiretDto>;
    amount: ProviderValue<number>;
    dateOperation: ProviderValue<Date>;
    programme: ProviderValue<number>;
    libelleProgramme?: ProviderValue<string>;
}
