import { FonjepPayment, ChorusPayment } from "../payments";

export interface GetPaymentsSuccessResponseDto {
    versements: (ChorusPayment | FonjepPayment)[];
}

export type GetPaymentsResponseDto = GetPaymentsSuccessResponseDto;
