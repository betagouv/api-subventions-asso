import { AssociationWithProviderValues } from "./AssociationWithProviderValues";

/** Réponse de GET /association/{identifier} */
export interface GetAssociationSuccessResponse {
    /** Données de l'association agrégées depuis plusieurs sources */
    association: AssociationWithProviderValues;
}

export type GetAssociationResponseDto = GetAssociationSuccessResponse;
