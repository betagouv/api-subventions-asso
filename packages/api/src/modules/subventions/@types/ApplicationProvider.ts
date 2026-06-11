import type { DemandeSubvention } from "dto";
import type Provider from "../../providers/@types/IProvider";
import type { StructureIdentifier } from "../../../identifier-objects/@types/StructureIdentifier";
import type { ApplicationFlatEntity } from "../../../entities/flats/ApplicationFlatEntity";

export default interface ApplicationProvider extends Provider {
    isApplicationProvider: boolean;

    getApplication(id: StructureIdentifier): Promise<DemandeSubvention[]>;

    saveFromStream(stream: ReadableStream<ApplicationFlatEntity>): void;
}
