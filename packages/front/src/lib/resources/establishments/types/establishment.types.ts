import type { Adresse } from "dto/shared/Adresse";
import type { SiretDto } from "dto/shared/Siret";

export interface SimplifiedEstablishment {
    siret: SiretDto;
    nic: string;
    siege?: boolean;
    ouvert?: boolean;
    adresse?: Adresse;
    headcount?: string;
}
