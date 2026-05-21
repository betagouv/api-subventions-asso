import { UserWithJWTDto } from "../user/UserDto";
import { LoginErrorCodes } from "core";

export interface LoginDtoPositiveResponse {
    user: UserWithJWTDto;
}

export interface LoginDtoNegativeResponse {
    message: string;
    code: LoginErrorCodes;
}

export type LoginDtoResponse = LoginDtoPositiveResponse | LoginDtoNegativeResponse;
