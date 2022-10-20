import { SuccessResponse } from "../shared/ResponseStatus";
import { UserDtoErrorResponse } from "./UserDtoResponse";

export interface CreateUserDtoSuccess extends SuccessResponse {
    email: string
}

export type CreateUserDtoResponse = CreateUserDtoSuccess | UserDtoErrorResponse