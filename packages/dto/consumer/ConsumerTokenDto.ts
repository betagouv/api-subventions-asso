import ErreurReponse from "../shared/ErreurReponse";

export interface ConsumerTokenDtoPositiveResponse {
    token: string;
}

export type ConsumerTokenDtoNegativeResponse = ErreurReponse;

export type ConsumerTokenDtoResponse = ConsumerTokenDtoPositiveResponse | ConsumerTokenDtoNegativeResponse;
