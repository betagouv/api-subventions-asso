import { UserWithResetTokenDto } from "../user";

export enum ResetPasswordErrorCodes {
    RESET_TOKEN_NOT_FOUND = 1,
    RESET_TOKEN_EXPIRED = 2,
    USER_NOT_FOUND = 3,
    PASSWORD_FORMAT_INVALID = 4,
    INTERNAL_ERROR = 5,
    PROCONNECT_NO_RESET = 6,
}

export interface ResetPasswordDtoPositiveResponse {
    user: UserWithResetTokenDto;
}

export type ResetPasswordDtoResponse = ResetPasswordDtoPositiveResponse;
