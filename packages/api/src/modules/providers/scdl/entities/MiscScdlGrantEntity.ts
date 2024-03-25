import { ScdlStorableGrant } from "../@types/ScdlStorableGrant";

export default interface MiscScdlGrantEntity extends ScdlStorableGrant {
    producerSlug: string;
}
