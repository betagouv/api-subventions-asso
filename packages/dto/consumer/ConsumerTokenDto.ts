import { SuccessResponse, ErrorResponse } from "../shared/ResponseStatus";

export interface ConsumerTokenDtoPositiveResponse extends SuccessResponse {
    token: string
}

export type ConsumerTokenDtoNegativeResponse = ErrorResponse

export type ConsumerTokenDtoResponse = ConsumerTokenDtoPositiveResponse | ConsumerTokenDtoNegativeResponse;