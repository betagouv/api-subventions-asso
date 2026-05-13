import { DocumentWithProviderValueDto, DocumentRequestDto } from "dto";

export const documentToDocumentRequest = (doc: DocumentWithProviderValueDto): DocumentRequestDto => ({
    type: doc.type.value,
    url: doc.url.value,
    nom: doc.nom.value,
});
