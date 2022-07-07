import { SuccessResponse, ErrorResponse } from "../shared/ResponseStatus";
import { Association } from "../search/Association";

export interface GetAssociationSuccessResponse extends SuccessResponse {
    association: Association,
}

export type GetAssociationResponseDto = GetAssociationSuccessResponse | ErrorResponse;