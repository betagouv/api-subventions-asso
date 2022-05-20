import { Etablissement } from "../search/Etablissment";


export interface GetEtablissementsPositiveResponseDto {
    success: true,
    etablissements: Etablissement[]
}

export interface GetEtablissementsNegativeResponseDto {
    success: false,
    message: string
}

export type GetEtablissementsResponseDto = GetEtablissementsNegativeResponseDto | GetEtablissementsPositiveResponseDto;