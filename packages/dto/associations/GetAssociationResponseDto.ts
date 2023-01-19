import ErreurReponse from "../shared/ErreurReponse";
import { Association } from "./Association";

export interface GetAssociationSuccessResponse {
    association: Association;
}

export type GetAssociationResponseDto = GetAssociationSuccessResponse | ErreurReponse;
