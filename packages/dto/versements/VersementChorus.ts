import { ProviderValue } from "../shared/ProviderValue";
import { Versement } from "./Versement";

export interface VersementChorus extends Versement {
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