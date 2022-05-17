export enum LoginDtoErrorCodes {
    EMAIL_OR_PASSWORD_NOT_MATCH = 1,
    USER_NOT_ACTIVE = 2,
    INTERNAL_ERROR = 3
}

export interface LoginDtoPositiveResponse {
    success: true, 
    data: {
        token: string,
        expirateDate: Date
    }
}

export interface LoginDtoNegativeResponse {
    success: false, 
    data: {
        message: string,
        errorCode: LoginDtoErrorCodes
    }
}

export type LoginDtoResponse = LoginDtoPositiveResponse | LoginDtoNegativeResponse;