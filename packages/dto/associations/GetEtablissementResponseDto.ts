import { Etablissement } from "../etablissements/Etablissement";

export interface GetEtablissementSuccessResponseDto {
    etablissement: Omit<Omit<Etablissement, "demandes_subventions">, "versements">;
}

export interface SearchEtablissementSuccessResponseDto {
    etablissement: Etablissement;
}

export type GetEtablissementResponseDto = GetEtablissementSuccessResponseDto | SearchEtablissementSuccessResponseDto;
