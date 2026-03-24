import UserDto from "./UserDto";

export interface CreateUserDtoSuccess {
    user: UserDto;
}

export type CreateUserDtoResponse = CreateUserDtoSuccess;
