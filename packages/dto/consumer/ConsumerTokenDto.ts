import { ErrorResponse } from "../shared/ErrorResponse";

export interface ConsumerTokenDtoPositiveResponse {
    token: string;
}

export type ConsumerTokenDtoNegativeResponse = ErrorResponse;

export type ConsumerTokenDtoResponse = ConsumerTokenDtoPositiveResponse | ConsumerTokenDtoNegativeResponse;
