import { ErrorResponse } from "../shared/ErrorResponse";
import { Document } from "../search/Document";

export interface GetDocumentsSuccessResponseDto {
    documents: Document[];
}

export type GetDocumentsResponseDto = GetDocumentsSuccessResponseDto | ErrorResponse;
