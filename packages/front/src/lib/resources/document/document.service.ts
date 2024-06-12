import documentPort from "$lib/resources/document/document.port";
import type { DocumentEntity } from "$lib/entities/DocumentEntity";
import { DocumentAdapter } from "$lib/resources/document/document.adapter";

export class DocumentService {
    getAllDocs(identifier: string) {
        return documentPort.getAllDocs(identifier);
    }

    getSomeDocs(docsToRequest: DocumentEntity[]) {
        const requests = docsToRequest.map(doc => DocumentAdapter.documentEntityToDocumentRequst(doc));
        return documentPort.getSomeDocs(requests);
    }
}

const documentService = new DocumentService();

export default documentService;
