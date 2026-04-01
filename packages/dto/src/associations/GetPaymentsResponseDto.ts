import { FonjepPayment, ChorusPayment } from "../payments";

/** Réponse de GET /association/{identifier}/versements */
export interface GetPaymentsSuccessResponseDto {
    /** Versements de l'association agrégés depuis Chorus et Fonjep */
    versements: (ChorusPayment | FonjepPayment)[];
}

export type GetPaymentsResponseDto = GetPaymentsSuccessResponseDto;
