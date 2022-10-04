import { ErrorResponse, SuccessResponse } from "../shared/ResponseStatus";
import { VersementFonjep, VersementChorus } from "../versements";

export interface GetVersementsSuccessResponseDto extends SuccessResponse {
    versements: (VersementChorus | VersementFonjep)[]
}

export type GetVersementsResponseDto = GetVersementsSuccessResponseDto | ErrorResponse;