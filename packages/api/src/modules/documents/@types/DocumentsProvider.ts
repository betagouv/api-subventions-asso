import { DocumentDto } from "dto";
import Provider from "../../providers/@types/IProvider";
import EstablishmentIdentifier from "../../../identifierObjects/EstablishmentIdentifier";
import { StructureIdentifier } from "../../../identifierObjects/@types/StructureIdentifier";

export default interface DocumentProvider extends Provider {
    isDocumentProvider: boolean;

    getDocuments(identifier: StructureIdentifier): Promise<DocumentDto[]>;
    getRibs?: (identifier: EstablishmentIdentifier) => Promise<DocumentDto[]>;
}
