import { ErrorResponse, SuccessResponse } from "../shared/ResponseStatus";
import { Versement } from "../versements/Versement";

export interface GetVersementsSuccessResponseDto extends SuccessResponse {
    versements: Versement[]
}

export type GetVersementsResponseDto = GetVersementsSuccessResponseDto | ErrorResponse;