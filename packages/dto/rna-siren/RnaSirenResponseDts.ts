import { Rna } from "../shared/Rna";
import { Siren } from "../shared/Siren";

export interface GetRnaSirenSuccessResponse {
    siren: Siren;
    rna: Rna;
}

export interface GetRnaSirenErrorResponse {
    siren: Siren | null;
    rna: Rna | null;
}

export type RnaSirenResponseDto = GetRnaSirenSuccessResponse | GetRnaSirenErrorResponse;
