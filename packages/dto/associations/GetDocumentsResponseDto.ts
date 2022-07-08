import { ErrorResponse, SuccessResponse } from "../shared/ResponseStatus";
import { Document } from "../search/Document";

export interface GetDocumentsSuccessResponseDto extends SuccessResponse {
    documents: Document[]
}

export type GetDocumentsResponseDto = GetDocumentsSuccessResponseDto | ErrorResponse;