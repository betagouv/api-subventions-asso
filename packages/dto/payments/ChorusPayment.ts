import { ProviderValue } from "../shared/ProviderValue";
import { BasePayment } from "./BasePayment";

export interface ChorusPayment extends BasePayment {
    centreFinancier: ProviderValue<string>;
    domaineFonctionnel: ProviderValue<string>;
    numeroDemandePayment?: ProviderValue<string>;
    numeroTier?: ProviderValue<string>;
    activitee?: ProviderValue<string>;
    compte?: ProviderValue<string>;
    codeBranche?: ProviderValue<string>;
    branche?: ProviderValue<string>;
    type?: ProviderValue<string>;
    bop: ProviderValue<string>;
}
