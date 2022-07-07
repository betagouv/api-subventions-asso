import { SuccessResponse } from "../shared/ResponseStatus"
import { Rna } from "../shared/Rna"
import { Siren } from "../shared/Siren"
import { ErrorResponse } from "../shared/ResponseStatus"

export interface GetRnaSirenSuccessResponse extends SuccessResponse {
    siren: Siren,
    rna: Rna
}

export interface GetRnaSirenErrorResponse {
    success: false,
    siren: Siren | null,
    rna: Rna | null
}

export type RnaSirenResponseDto = GetRnaSirenSuccessResponse | GetRnaSirenErrorResponse