import Provider from "../../providers/@types/IProvider";
import { StructureIdentifier } from "../../../@types";
import { RawGrant } from "./rawGrant";

export default interface GrantProvider extends Provider {
    isGrantProvider: boolean;

    getRawGrants(identifier: StructureIdentifier): Promise<RawGrant[]>;
}
