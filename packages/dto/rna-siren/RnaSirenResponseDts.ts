import { RnaDto } from "../shared/Rna";
import { SirenDto } from "../shared/Siren";

export interface GetRnaSirenSuccessResponse {
    siren: SirenDto;
    rna: RnaDto;
}

export interface GetRnaSirenErrorResponse {
    siren: SirenDto | null;
    rna: RnaDto | null;
}

export type RnaSirenResponseDto = GetRnaSirenSuccessResponse | GetRnaSirenErrorResponse;
