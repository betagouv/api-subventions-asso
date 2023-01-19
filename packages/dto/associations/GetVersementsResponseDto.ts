import ErreurReponse from "../shared/ErreurReponse";
import { VersementFonjep, VersementChorus } from "../versements";

export interface GetVersementsSuccessResponseDto {
    versements: (VersementChorus | VersementFonjep)[];
}

export type GetVersementsResponseDto = GetVersementsSuccessResponseDto | ErreurReponse;
