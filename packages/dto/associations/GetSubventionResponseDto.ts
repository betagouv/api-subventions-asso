import { DemandeSubvention } from "../search/DemandeSubvention";
import ErreurReponse from "../shared/ErreurReponse";

export interface GetSubventionSuccessResponseDto {
    subvention: DemandeSubvention;
}

export type GetSubventionResponseDto = GetSubventionSuccessResponseDto | ErreurReponse;
