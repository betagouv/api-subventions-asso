import { PaymentFlatDto } from "../flat";

/** Réponse de GET /association/{identifier}/paiements */
export interface GetPaymentsFlatSuccessResponseDto {
    /** Versements de l'association au format plat */
    paiements: PaymentFlatDto[];
}

export type GetPaymentsFlatResponseDto = GetPaymentsFlatSuccessResponseDto;
