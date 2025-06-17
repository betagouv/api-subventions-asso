import { DemandeSubvention } from "dto";
import { RawApplication } from "../../grant/@types/rawGrant";
import Provider from "../../providers/@types/IProvider";
import { StructureIdentifier } from "../../../identifierObjects/@types/StructureIdentifier";

export default interface DemandesSubvenentionsProvider<T> extends Provider {
    isDemandesSubventionsProvider: boolean;

    // TODO: find a way to merge DemandeSubvention and Application...
    rawToApplication: (rawApplication: RawApplication<T>) => DemandeSubvention | null;

    getDemandeSubvention(id: StructureIdentifier): Promise<DemandeSubvention[]>;
}
