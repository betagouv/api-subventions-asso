import { DemandeSubvention } from "../demandeSubvention";

export interface GetSubventionSuccessResponseDto {
    subvention: DemandeSubvention;
}

export type GetSubventionResponseDto = GetSubventionSuccessResponseDto;
