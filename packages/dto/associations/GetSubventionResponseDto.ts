import { DemandeSubvention } from "../search/DemandeSubvention";
import { ErrorResponse } from "../shared/ErrorResponse";

export interface GetSubventionSuccessResponseDto {
    subvention: DemandeSubvention;
}

export type GetSubventionResponseDto = GetSubventionSuccessResponseDto | ErrorResponse;
