import { Adresse } from "../shared/Adresse";
import { SiretDto } from "../shared/Siret";

export interface SimplifiedEstablishment {
    siret: SiretDto;
    nic: string;
    siege?: boolean;
    ouvert?: boolean;
    adresse?: Adresse;
    headcount?: string;
}
