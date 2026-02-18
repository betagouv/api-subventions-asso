import type { DemandeSubvention } from "dto";
import type { RawApplication } from "../../grant/@types/rawGrant";
import type Provider from "../../providers/@types/IProvider";
import type { StructureIdentifier } from "../../../identifierObjects/@types/StructureIdentifier";
import type { ApplicationFlatEntity } from "../../../entities/flats/ApplicationFlatEntity";

export default interface ApplicationProvider extends Provider {
    isApplicationProvider: boolean;

    // TODO: find a way to merge DemandeSubvention and Application...
    rawToApplication: (rawApplication: RawApplication) => DemandeSubvention | null;

    getApplication(id: StructureIdentifier): Promise<DemandeSubvention[]>;

    saveFromStream(stream: ReadableStream<ApplicationFlatEntity>): void;
}
