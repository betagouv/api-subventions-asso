import { Siren, Siret } from "dto";
import Provider from "../../providers/@types/IProvider";
import { RawGrant } from "./rawGrant";

export default interface GrantProvider extends Provider {
    isGrantProvider: boolean;

    getGrantsBySiret(siret: Siret): Promise<RawGrant[] | null>;
    getGrantsBySiren(siren: Siren): Promise<RawGrant[] | null>;

    getRawGrantsBySiret(siret: Siret): Promise<RawGrant[] | null>;
    getRawGrantsBySiren(siren: Siren): Promise<RawGrant[] | null>;
}
