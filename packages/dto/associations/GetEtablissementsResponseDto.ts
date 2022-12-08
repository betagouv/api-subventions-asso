import { Etablissement } from "../etablissements/Etablissement";
import { ErrorResponse, SuccessResponse } from "../shared/ResponseStatus";

export interface GetEtablissementsSuccessResponseDto extends SuccessResponse {
    etablissements: Etablissement[]
}

export type GetEtablissementsResponseDto = GetEtablissementsSuccessResponseDto | ErrorResponse;