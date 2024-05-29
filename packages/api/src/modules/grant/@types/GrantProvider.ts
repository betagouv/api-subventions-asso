import { Rna, Siren, Siret } from "dto";
import Provider from "../../providers/@types/IProvider";
import { RawGrant } from "./rawGrant";

export default interface GrantProvider extends Provider {
    isGrantProvider: boolean;

    getGrantsBySiret(siret: Siret): Promise<[] | null>;
    getGrantsBySiren(siren: Siren): Promise<[] | null>;

    getRawGrantsBySiret(siret: Siret): Promise<RawGrant[] | null>;
    getRawGrantsBySiren(siren: Siren): Promise<RawGrant[] | null>;
}
