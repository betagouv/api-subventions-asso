import { Etablissement } from "../search/Etablissment";
import { ErrorResponse, SuccessResponse } from "../shared/ResponseStatus";

export interface GetEtablissementSuccessResponseDto extends SuccessResponse {
    etablissement: Omit<Omit<Etablissement, "demandes_subventions">, "versements">
}

export type GetEtablissementResponseDto = GetEtablissementSuccessResponseDto | ErrorResponse;