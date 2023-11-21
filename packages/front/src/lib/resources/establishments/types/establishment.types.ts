import type { Adresse } from "dto/shared/Adresse";
import type { Siret } from "dto/shared/Siret";

export interface SimplifiedEstablishment {
    siret: Siret;
    nic: string;
    siege?: boolean;
    ouvert?: boolean;
    adresse?: Adresse;
    headcount?: string;
}
