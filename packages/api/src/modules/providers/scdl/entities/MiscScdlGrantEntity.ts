import { Siret } from "dto";
import { ScdlStorableGrant } from "../@types/ScdlStorableGrant";

export default interface MiscScdlGrantEntity extends ScdlStorableGrant {
    producerSlug: string;
    allocatorName: string;
    allocatorSiret: Siret;
}
