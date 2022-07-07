import { ErrorResponse, SuccessResponse } from "../shared/ResponseStatus";
import { DemandeSubvention } from "../search/DemandeSubvention";

export interface GetSubventionsSuccessResponseDto extends SuccessResponse {
    subventions: DemandeSubvention[]
}

export type GetSubventionsResponseDto = GetSubventionsSuccessResponseDto | ErrorResponse;