import { UserWithResetTokenDto } from "../user";

export interface ResetPasswordDtoPositiveResponse {
    user: UserWithResetTokenDto;
}

export type ResetPasswordDtoResponse = ResetPasswordDtoPositiveResponse;
