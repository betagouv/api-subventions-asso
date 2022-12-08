import { SuccessResponse, ErrorResponse } from "../shared/ResponseStatus";
import { Association } from "./Association";

export interface GetAssociationSuccessResponse extends SuccessResponse {
    association: Association,
}

export type GetAssociationResponseDto = GetAssociationSuccessResponse | ErrorResponse;