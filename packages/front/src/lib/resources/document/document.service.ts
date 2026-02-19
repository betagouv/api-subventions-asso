import documentPort from "$lib/resources/document/document.port";
import type { DocumentEntity } from "$lib/entities/DocumentEntity";
import { DocumentMapper } from "$lib/resources/document/document.mapper";

export class DocumentService {
    getAllDocs(identifier: string) {
        return documentPort.getAllDocs(identifier);
    }

    getSomeDocs(docsToRequest: DocumentEntity[]) {
        const requests = docsToRequest.map(doc => DocumentMapper.documentEntityToDocumentRequst(doc));
        return documentPort.getSomeDocs(requests);
    }
}

const documentService = new DocumentService();

export default documentService;
