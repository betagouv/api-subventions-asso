import { DemandeSubvention } from "../search/DemandeSubvention";

export interface GetSubventionsSuccessResponseDto {
    subventions: DemandeSubvention[] | null;
}

export type GetSubventionsResponseDto = GetSubventionsSuccessResponseDto;
