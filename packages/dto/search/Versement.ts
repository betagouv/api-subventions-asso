import { ProviderValue } from "../shared/ProviderValue";
import { Siret } from "../shared/Siret";

export interface Versement {
    id: string,
    ej: ProviderValue<string>;
    siret: ProviderValue<Siret>;
    amount: ProviderValue<number>;
    dateOperation: ProviderValue<Date>;
    centreFinancier: ProviderValue<string>
    domaineFonctionnel: ProviderValue<string>,
    numeroDemandePayment?: ProviderValue<string>;
    numeroTier?: ProviderValue<string>;
    activitee?: ProviderValue<string>;
    compte?: ProviderValue<string>;
    codeBranche?: ProviderValue<string>;
    branche?: ProviderValue<string>;
    type?: ProviderValue<string>;
}