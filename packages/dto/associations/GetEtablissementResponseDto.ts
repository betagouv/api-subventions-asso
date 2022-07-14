import { Etablissement } from "../search/Etablissement";
import { ErrorResponse, SuccessResponse } from "../shared/ResponseStatus";

export interface GetEtablissementSuccessResponseDto extends SuccessResponse {
    etablissement: Omit<Omit<Etablissement, "demandes_subventions">, "versements">
}

export interface SearchEtablissementSuccessResponseDto extends SuccessResponse {
    etablissement: Etablissement
}

export type GetEtablissementResponseDto = GetEtablissementSuccessResponseDto | SearchEtablissementSuccessResponseDto | ErrorResponse;