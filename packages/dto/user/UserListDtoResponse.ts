import { SuccessResponse } from "../shared/ResponseStatus";
import { UserWithResetTokenDto } from "./UserDto";
import { UserDtoErrorResponse } from "./UserDtoResponse";

export interface UserListDtoSuccess extends SuccessResponse {
    users: UserWithResetTokenDto[]
}

export type UserListDtoResponse = UserListDtoSuccess | UserDtoErrorResponse