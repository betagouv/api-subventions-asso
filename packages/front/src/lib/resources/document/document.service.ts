import type { Siret } from "dto";
import documentPort from "$lib/resources/document/document.port";
import type { DocumentEntity } from "$lib/entities/DocumentEntity";

export class DocumentService {
    getAllDocs(identifier: string) {
        return documentPort.getAllDocs(identifier);
    }

    filterAssoDocsBySiret(docs: DocumentEntity[], siret: Siret) {
        return docs.filter(doc => !doc.__meta__.siret || doc.__meta__.siret === siret);
    }
}

const documentService = new DocumentService();

export default documentService;
