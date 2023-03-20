import { Etablissement } from "../etablissements/Etablissement";

export interface GetEtablissementsSuccessResponseDto {
    etablissements: Etablissement[];
}

export type GetEtablissementsResponseDto = GetEtablissementsSuccessResponseDto;
