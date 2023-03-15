import { UserWithResetTokenDto } from "./UserDto";

export interface UserListDtoSuccess {
    users: UserWithResetTokenDto[];
}

export type UserListDtoResponse = UserListDtoSuccess;
