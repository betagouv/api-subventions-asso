import { DemandeSubvention } from "../demandeSubvention";

/** Réponse de GET /association/{identifier}/subventions */
export interface GetSubventionsSuccessResponseDto {
    /** Demandes de subventions de l'association. Null si aucune donnée disponible. */
    subventions: DemandeSubvention[] | null;
}

export type GetSubventionsResponseDto = GetSubventionsSuccessResponseDto;
