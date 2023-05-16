import { Rna, Siren, Siret } from "@api-subventions-asso/dto";
import Provider from "../../providers/@types/IProvider";
import { RawGrant } from "./rawGrant";

export default interface GrantProvider extends Provider {
    isGrantProvider: boolean;

    getRawGrantsBySiret(siret: Siret): Promise<RawGrant[] | null>;
    getRawGrantsBySiren(siren: Siren): Promise<RawGrant[] | null>;
    getRawGrantsByRna(rna: Rna): Promise<RawGrant[] | null>;
}
