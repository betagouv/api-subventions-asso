import { Etablissement } from "../etablissements/Etablissement";
import { ErrorResponse } from "../shared/ErrorResponse";

export interface GetEtablissementsSuccessResponseDto {
    etablissements: Etablissement[];
}

export type GetEtablissementsResponseDto = GetEtablissementsSuccessResponseDto | ErrorResponse;
