import { ErrorResponse } from "../shared/ErrorResponse";
import { Association } from "./Association";

export interface GetAssociationSuccessResponse {
    association: Association;
}

export type GetAssociationResponseDto = GetAssociationSuccessResponse | ErrorResponse;
