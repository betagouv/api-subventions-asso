import { Etablissement } from "../etablissements/Etablissement";
import ErreurReponse from "../shared/ErreurReponse";

export interface GetEtablissementSuccessResponseDto {
    etablissement: Omit<Omit<Etablissement, "demandes_subventions">, "versements">;
}

export interface SearchEtablissementSuccessResponseDto {
    etablissement: Etablissement;
}

export type GetEtablissementResponseDto =
    | GetEtablissementSuccessResponseDto
    | SearchEtablissementSuccessResponseDto
    | ErreurReponse;
