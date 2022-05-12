import { SuccessResponse, ErrorResponse } from "../shared/ResponseStatus";
import { Association } from "../search/Association";

export interface GetAssociationSuccessResponse extends SuccessResponse {
    success: true,
    association?: Association,
    message?: string
}
export interface GetAssociationErrorResponse extends ErrorResponse {
    success: false,
    message: string
}

export type GetAssociationResponseDto = GetAssociationSuccessResponse | GetAssociationErrorResponse;