import documentPort from "$lib/resources/document/document.port";

export class DocumentService {
    getAllDocs(identifier: string) {
        return documentPort.getAllDocs(identifier);
    }
}

const documentService = new DocumentService();

export default documentService;
