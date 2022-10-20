import { ErrorResponse, SuccessResponse } from "../shared/ResponseStatus";
import UserDto from "./UserDto"

export interface UserDtoSuccessResponse extends SuccessResponse {
    user: UserDto
}

export interface UserDtoErrorResponse extends ErrorResponse {
    errorCode: number
}

export type UserDtoResponse = UserDtoSuccessResponse | UserDtoErrorResponse;