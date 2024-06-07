import { PaymentFonjep, PaymentChorus } from "../payments";

export interface GetPaymentsSuccessResponseDto {
    versements: (PaymentChorus | PaymentFonjep)[];
}

export type GetPaymentsResponseDto = GetPaymentsSuccessResponseDto;
