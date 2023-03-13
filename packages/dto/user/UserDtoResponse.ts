import UserDto from "./UserDto";

export interface UserDtoSuccessResponse {
    user: UserDto;
}

export type UserDtoResponse = UserDtoSuccessResponse;
