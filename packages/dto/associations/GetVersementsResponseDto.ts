import { ErrorResponse, SuccessResponse } from "../shared/ResponseStatus";
import { Versement } from "../search/Versement";

export interface GetVersementsSuccessResponseDto extends SuccessResponse {
    versements: Versement[]
}

export type GetVersementsResponseDto = GetVersementsSuccessResponseDto | ErrorResponse;