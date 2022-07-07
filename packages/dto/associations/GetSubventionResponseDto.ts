import { DemandeSubvention } from "../search/DemandeSubvention";
import { ErrorResponse, SuccessResponse } from "../shared/ResponseStatus";

export interface GetSubventionSuccessResponseDto extends SuccessResponse {
    subvention: DemandeSubvention
}

export type GetSubventionResponseDto = GetSubventionSuccessResponseDto | ErrorResponse;