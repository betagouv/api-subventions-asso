import { ErrorResponse } from "../shared/ErrorResponse";
import UserDto from "./UserDto";

export interface UserDtoSuccessResponse {
    user: UserDto;
}

export interface UserDtoErrorResponse extends ErrorResponse {
    errorCode: number;
}

export type UserDtoResponse = UserDtoSuccessResponse | UserDtoErrorResponse;
