import { SiretDto } from "dto";
import { ScdlStorableGrant } from "../@types/ScdlStorableGrant";

export default interface MiscScdlGrantEntity extends ScdlStorableGrant {
    allocatorName: string;
    allocatorSiret: SiretDto;
}
