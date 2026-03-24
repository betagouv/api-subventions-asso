import { Association } from "./Association";

export interface GetAssociationSuccessResponse {
    association: Association;
}

export type GetAssociationResponseDto = GetAssociationSuccessResponse;
