import { EstablishmentWithProviderValues } from "../establishments";

/** Réponse de GET /association/{identifier}/etablissements */
export interface GetEstablishmentsSuccessResponseDto {
    /** Liste des établissements rattachés à l'association */
    etablissements: EstablishmentWithProviderValues[];
}

export type GetEstablishmentsResponseDto = GetEstablishmentsSuccessResponseDto;
