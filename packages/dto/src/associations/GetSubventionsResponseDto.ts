import { DemandeSubvention } from "../demandeSubvention";

export interface GetSubventionsSuccessResponseDto {
    subventions: DemandeSubvention[] | null;
}

export type GetSubventionsResponseDto = GetSubventionsSuccessResponseDto;
