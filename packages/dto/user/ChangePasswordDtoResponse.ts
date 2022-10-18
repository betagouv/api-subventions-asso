import { ErrorResponse } from "../shared/ResponseStatus";
import { UserDtoSuccessResponse } from "./UserDtoResponse";

interface ChangePasswordErrorResponse extends ErrorResponse {
    code: number
}

export type ChangePasswordDtoResponse = UserDtoSuccessResponse | ChangePasswordErrorResponse