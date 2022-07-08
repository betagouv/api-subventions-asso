import { WithId } from "mongodb"
import { UserWithTokenDto } from "../user/UserDto"

export enum ResetPasswordErrorCodes {
    RESET_TOKEN_NOT_FOUND = 1,
    RESET_TOKEN_EXPIRED = 2,
    USER_NOT_FOUND = 3,
    PASSWORD_FORMAT_INVALID = 4,
    INTERNAL_ERROR = 5,
}

export interface ResetPasswordDtoPositiveResponse {
    success: true,
    data: {
        user: WithId<UserWithTokenDto>
    }
}

export interface ResetPasswordDtoNegativeResponse {
    success: false,
    data: {
        message: string,
        code: ResetPasswordErrorCodes
    }
}

export type ResetPasswordDtoResponse = ResetPasswordDtoNegativeResponse | ResetPasswordDtoPositiveResponse;