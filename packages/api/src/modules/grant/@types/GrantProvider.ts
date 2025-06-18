import { StructureIdentifier } from "../../../identifierObjects/@types/StructureIdentifier";
import Provider from "../../providers/@types/IProvider";
import { RawGrant } from "./rawGrant";

export default interface GrantProvider extends Provider {
    isGrantProvider: boolean;

    getRawGrants(identifier: StructureIdentifier): Promise<RawGrant[]>;
}
