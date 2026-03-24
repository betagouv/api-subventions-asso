import { UserWithJWTDto } from "../user/UserDto";

export enum LoginDtoErrorCodes {
    EMAIL_OR_PASSWORD_NOT_MATCH = 1,
    USER_NOT_ACTIVE = 2,
    INTERNAL_ERROR = 3,
    PASSWORD_UNSET = 4,
}

export interface LoginDtoPositiveResponse {
    user: UserWithJWTDto;
}

export interface LoginDtoNegativeResponse {
    message: string;
    code: LoginDtoErrorCodes;
}

export type LoginDtoResponse = LoginDtoPositiveResponse | LoginDtoNegativeResponse;
