import { UserWithResetTokenDto } from "./UserDto";
import { UserDtoErrorResponse } from "./UserDtoResponse";

export interface UserListDtoSuccess {
    users: UserWithResetTokenDto[];
}

export type UserListDtoResponse = UserListDtoSuccess | UserDtoErrorResponse;
