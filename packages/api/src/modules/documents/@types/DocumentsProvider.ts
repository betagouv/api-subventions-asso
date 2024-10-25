import { DocumentDto } from "dto";
import Provider from "../../providers/@types/IProvider";
import { StructureIdentifier } from "../../../@types";
import EstablishmentIdentifier from "../../../valueObjects/EstablishmentIdentifier";

export default interface DocumentProvider extends Provider {
    isDocumentProvider: boolean;

    getDocuments(identifier: StructureIdentifier): Promise<DocumentDto[]>;
    getRibs?: (identifier: EstablishmentIdentifier) => Promise<DocumentDto[]>;
}
