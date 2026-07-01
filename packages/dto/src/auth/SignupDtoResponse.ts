import { UserDto } from "../user";

export interface SignupDtoPositiveResponse {
    user: UserDto;
}

export interface SignupDtoNegativeResponse {
    message: string;
}

export type SignupDtoResponse = SignupDtoNegativeResponse | SignupDtoPositiveResponse;
