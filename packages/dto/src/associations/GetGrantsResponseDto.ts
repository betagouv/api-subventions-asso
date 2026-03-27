import { GrantFlatDto } from "../flat";
import { Grant } from "../grant/grant";

/** Réponse de GET /association/{identifier}/grants (déprécié) */
export interface GetOldGrantsSuccessResponseDto {
    /** Subventions agrégées (demandes + versements) au format legacy */
    subventions: Grant[];
    /** Nombre total de subventions */
    count: number;
}

/** Réponse de GET /association/{identifier}/grants/v2 */
export interface GetGrantsSuccessResponseDto {
    /** Subventions agrégées (demandes + versements) au format plat */
    subventions: GrantFlatDto[];
    /** Nombre total de subventions */
    count: number;
}

export type GetOldGrantsResponseDto = GetOldGrantsSuccessResponseDto;
export type GetGrantsResponseDto = GetGrantsSuccessResponseDto;
