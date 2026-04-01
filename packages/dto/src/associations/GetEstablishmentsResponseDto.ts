import { Establishment } from "../establishments";

/** Réponse de GET /association/{identifier}/etablissements */
export interface GetEstablishmentsSuccessResponseDto {
    /** Liste des établissements rattachés à l'association */
    etablissements: Establishment[];
}

export type GetEstablishmentsResponseDto = GetEstablishmentsSuccessResponseDto;
