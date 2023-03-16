import { Document } from "../search/Document";

export interface GetDocumentsSuccessResponseDto {
    documents: Document[];
}

export type GetDocumentsResponseDto = GetDocumentsSuccessResponseDto;
