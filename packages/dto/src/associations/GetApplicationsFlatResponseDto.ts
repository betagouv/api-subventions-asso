import { ApplicationFlatDto } from "../flat";

/** Réponse de GET /association/{identifier}/applications */
export interface GetApplicationsFlatSuccessResponseDto {
    /** Demandes de subventions de l'association au format plat */
    applications: ApplicationFlatDto[];
}

export type GetApplicationsFlatResponseDto = GetApplicationsFlatSuccessResponseDto;
