import { DocumentDto, DocumentRequestDto } from "dto";

export const documentToDocumentRequest = (doc: DocumentDto): DocumentRequestDto =>
     ({ type: doc.type.value,
        url: doc.url.value,
        nom: doc.nom.value
        })
;
