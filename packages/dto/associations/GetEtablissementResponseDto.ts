import { Etablissement } from "../search/Etablissment";


export interface GetEtablissementPositiveResponseDto {
    success: true,
    etablissement: Omit<Omit<Etablissement, "demandes_subventions">, "versements">
}

export interface GetEtablissementNegativeResponseDto {
    success: false,
    message: string
}

export type GetEtablissementResponseDto = GetEtablissementPositiveResponseDto | GetEtablissementNegativeResponseDto;