export enum TokenValidationType {
    SIGNUP,
    FORGET_PASSWORD,
}

export interface TokenValidationDtoPositiveResponse {
    valid: true;
    type: TokenValidationType;
}

export interface TokenValidationDtoNegativeResponse {
    valid: false;
}

export type TokenValidationDtoResponse = TokenValidationDtoPositiveResponse | TokenValidationDtoNegativeResponse;
