import { UserDto } from "../user";

export enum SignupErrorCodes {
    EMAIL_NOT_VALID = 1,
    USER_ALREADY_EXISTS = 2,
    CREATION_ERROR = 3,
    CREATION_RESET_ERROR = 4,
    EMAIL_MUST_BE_END_GOUV = 5,
}

export interface SignupDtoPositiveResponse {
    user: UserDto;
}

export interface SignupDtoNegativeResponse {
    code: SignupErrorCodes;
    message: string;
}

export type SignupDtoResponse = SignupDtoNegativeResponse | SignupDtoPositiveResponse;
