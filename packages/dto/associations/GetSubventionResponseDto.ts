import { DemandeSubvention } from "../search/DemandeSubvention";

export interface GetSubventionSuccessResponseDto {
    subvention: DemandeSubvention;
}

export type GetSubventionResponseDto = GetSubventionSuccessResponseDto;
