import { Etablissement } from "../search/Etablissment";


export interface GetEtablissementPositiveResponseDto {
    success: true,
    etablissement: Etablissement
}

export interface GetEtablissementNegativeResponseDto {
    success: false,
    message: string
}

export type GetEtablissementResponseDto = GetEtablissementPositiveResponseDto | GetEtablissementNegativeResponseDto;