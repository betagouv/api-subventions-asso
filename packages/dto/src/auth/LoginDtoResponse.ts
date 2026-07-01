import { UserWithJWTDto } from "../user/UserDto";

export interface LoginDtoPositiveResponse {
    user: UserWithJWTDto;
}

export type LoginDtoResponse = LoginDtoPositiveResponse;
