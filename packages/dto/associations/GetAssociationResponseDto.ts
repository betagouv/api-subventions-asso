import {SuccessResponse, ErrorResponse} from "../shared/ResponseStatus";
import AssociationDto from "../search/AssociationDto";

export interface GetAssociationSuccessResponse extends SuccessResponse {
    success: true,
    association?: AssociationDto,
    message?: string
}
export interface GetAssociationErrorResponse extends ErrorResponse {
    success: false,
    message: string
}

export type GetAssociationResponseDto = GetAssociationSuccessResponse | GetAssociationErrorResponse;