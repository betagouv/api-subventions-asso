import { Etablissement } from "../etablissements/Etablissement";
import { ErrorResponse } from "../shared/ErrorResponse";

export interface GetEtablissementSuccessResponseDto {
    etablissement: Omit<Omit<Etablissement, "demandes_subventions">, "versements">;
}

export interface SearchEtablissementSuccessResponseDto {
    etablissement: Etablissement;
}

export type GetEtablissementResponseDto =
    | GetEtablissementSuccessResponseDto
    | SearchEtablissementSuccessResponseDto
    | ErrorResponse;
