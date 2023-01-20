import { ErrorResponse } from "../shared/ErrorResponse";
import { DemandeSubvention } from "../search/DemandeSubvention";

export interface GetSubventionsSuccessResponseDto {
    subventions: DemandeSubvention[];
}

export type GetSubventionsResponseDto = GetSubventionsSuccessResponseDto | ErrorResponse;
