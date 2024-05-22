import { DocumentDto } from "./DocumentDto";

export interface GetDocumentsSuccessResponseDto {
    documents: DocumentDto[];
}

export type GetDocumentsResponseDto = GetDocumentsSuccessResponseDto;
