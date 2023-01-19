import { UserDtoErrorResponse } from "./UserDtoResponse";

export interface CreateUserDtoSuccess {
    email: string;
}

export type CreateUserDtoResponse = CreateUserDtoSuccess | UserDtoErrorResponse;
