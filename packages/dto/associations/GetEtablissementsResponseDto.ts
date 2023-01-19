import { Etablissement } from "../etablissements/Etablissement";
import ErreurReponse from "../shared/ErreurReponse";

export interface GetEtablissementsSuccessResponseDto {
    etablissements: Etablissement[];
}

export type GetEtablissementsResponseDto = GetEtablissementsSuccessResponseDto | ErreurReponse;
