import type { DocumentRequestDto } from "dto";
import type { DocumentEntity } from "$lib/entities/DocumentEntity";

export class DocumentMapper {
    static documentEntityToDocumentRequst(doc: DocumentEntity): DocumentRequestDto {
        return { nom: doc.nom, type: doc.type, url: doc.url };
    }
}
