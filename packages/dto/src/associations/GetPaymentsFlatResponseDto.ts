import { PaymentFlatDto } from "../flat";

export interface GetPaymentsFlatSuccessResponseDto {
    paiements: PaymentFlatDto[];
}

export type GetPaymentsFlatResponseDto = GetPaymentsFlatSuccessResponseDto;
