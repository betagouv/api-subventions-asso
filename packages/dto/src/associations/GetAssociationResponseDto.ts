import { Association } from "./Association";

/** Réponse de GET /association/{identifier} */
export interface GetAssociationSuccessResponse {
    /** Données de l'association agrégées depuis plusieurs sources */
    association: Association;
}

export type GetAssociationResponseDto = GetAssociationSuccessResponse;
