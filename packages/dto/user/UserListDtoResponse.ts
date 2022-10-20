import { SuccessResponse } from "../shared/ResponseStatus";
import { UserWithTokenDto } from "./UserDto";
import { UserDtoErrorResponse } from "./UserDtoResponse";

export interface UserListDtoSuccess extends SuccessResponse {
    users: UserWithTokenDto[]
}

export type UserListDtoResponse = UserListDtoSuccess | UserDtoErrorResponse