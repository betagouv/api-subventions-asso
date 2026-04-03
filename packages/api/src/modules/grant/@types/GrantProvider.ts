import { StructureIdentifier } from "../../../identifier-objects/@types/StructureIdentifier";
import Provider from "../../providers/@types/IProvider";
import { AnyRawGrant } from "./RawGrant";

export default interface GrantProvider extends Provider {
    isGrantProvider: boolean;

    getRawGrants(identifier: StructureIdentifier): Promise<AnyRawGrant[]>;
}
