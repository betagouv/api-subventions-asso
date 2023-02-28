import { ProviderValue } from "../shared/ProviderValue";
import { BaseVersement } from "./BaseVersement";

export interface VersementChorus extends BaseVersement {
    centreFinancier: ProviderValue<string>;
    domaineFonctionnel: ProviderValue<string>;
    numeroDemandePayment?: ProviderValue<string>;
    numeroTier?: ProviderValue<string>;
    activitee?: ProviderValue<string>;
    compte?: ProviderValue<string>;
    codeBranche?: ProviderValue<string>;
    branche?: ProviderValue<string>;
    type?: ProviderValue<string>;
}
