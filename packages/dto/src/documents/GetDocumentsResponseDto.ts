import { DocumentDto } from "./DocumentDto";

/** Réponse de GET /association/{identifier}/documents */
export interface GetDocumentsSuccessResponseDto {
    /** Documents administratifs de l'association (RIB, statuts, attestations...) */
    documents: DocumentDto[];
}

export type GetDocumentsResponseDto = GetDocumentsSuccessResponseDto;
