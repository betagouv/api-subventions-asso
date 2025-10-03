import { DemandeSubvention } from "dto";
import { RawApplication } from "../../grant/@types/rawGrant";
import Provider from "../../providers/@types/IProvider";
import { StructureIdentifier } from "../../../identifierObjects/@types/StructureIdentifier";

export default interface ApplicationProvider extends Provider {
    isApplicationProvider: boolean;

    // TODO: find a way to merge DemandeSubvention and Application...
    rawToApplication: (rawApplication: RawApplication) => DemandeSubvention | null;

    getApplication(id: StructureIdentifier): Promise<DemandeSubvention[]>;
}
