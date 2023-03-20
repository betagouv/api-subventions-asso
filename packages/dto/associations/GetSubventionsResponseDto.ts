import { DemandeSubvention } from "../search/DemandeSubvention";

export interface GetSubventionsSuccessResponseDto {
    subventions: DemandeSubvention[];
}

export type GetSubventionsResponseDto = GetSubventionsSuccessResponseDto;
