import { Adresse } from "../shared/Adresse";
import { ProviderValues } from "../shared/ProviderValue";
import { Siret } from "../shared/Siret";

export interface SimplifiedEtablissement {
    siret: ProviderValues<Siret>;
    nic: ProviderValues<string>;
    siege?: ProviderValues<boolean>;
    ouvert?: ProviderValues<boolean>;
    adresse?: ProviderValues<Adresse>;
    headcount?: ProviderValues<string>;
}
