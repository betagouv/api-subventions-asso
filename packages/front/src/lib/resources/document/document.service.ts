import type { Siret } from "dto";
import documentPort from "$lib/resources/document/document.port";
import type { DocumentEntity } from "$lib/entities/DocumentEntity";

export type LabeledDoc = DocumentEntity & { showByDefault: boolean };

export class DocumentService {
    getAllDocs(identifier: string) {
        return documentPort.getAllDocs(identifier);
    }

    labelAssoDocsBySiret(docs: DocumentEntity[], siret: Siret): LabeledDoc[] {
        docs.forEach(doc => ((doc as LabeledDoc).showByDefault = !doc.__meta__.siret || doc.__meta__.siret === siret));
        return docs as LabeledDoc[];
    }
}

const documentService = new DocumentService();

export default documentService;
