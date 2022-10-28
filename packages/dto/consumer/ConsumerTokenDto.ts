
export interface ConsumerTokenDtoPositiveResponse {
    success: true,
    token: string
}

export interface ConsumerTokenDtoNegativeResponse {
    success: false,
    message: string,
}

export type ConsumerTokenDtoResponse = ConsumerTokenDtoPositiveResponse | ConsumerTokenDtoNegativeResponse;