import { DocumentWithProviderValueDto } from "dto";
import Provider from "../../providers/@types/IProvider";
import EstablishmentIdentifier from "../../../identifier-objects/EstablishmentIdentifier";
import { StructureIdentifier } from "../../../identifier-objects/@types/StructureIdentifier";

export default interface DocumentProvider extends Provider {
    isDocumentProvider: boolean;

    getDocuments(identifier: StructureIdentifier): Promise<DocumentWithProviderValueDto[]>;
    getRibs?: (identifier: EstablishmentIdentifier) => Promise<DocumentWithProviderValueDto[]>;
}
