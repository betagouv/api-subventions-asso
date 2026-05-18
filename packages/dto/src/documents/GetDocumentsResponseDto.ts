import { DocumentWithProviderValueDto } from "./DocumentWithProviderValueDto";

/** Réponse de GET /association/{identifier}/documents */
export interface GetDocumentsSuccessResponseDto {
    /** Documents administratifs de l'association (RIB, statuts, attestations...) */
    documents: DocumentWithProviderValueDto[];
}

export type GetDocumentsResponseDto = GetDocumentsSuccessResponseDto;
