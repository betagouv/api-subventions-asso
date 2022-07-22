import { Etablissement } from "../search/Etablissement";
import { ErrorResponse, SuccessResponse } from "../shared/ResponseStatus";

export interface GetEtablissementsSuccessResponseDto extends SuccessResponse {
    etablissements: Etablissement[]
}

export type GetEtablissementsResponseDto = GetEtablissementsSuccessResponseDto | ErrorResponse;