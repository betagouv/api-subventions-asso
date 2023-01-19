import ErreurReponse from "../shared/ErreurReponse";
import UserDto from "./UserDto";

export interface UserDtoSuccessResponse {
    user: UserDto;
}

export interface UserDtoErrorResponse extends ErreurReponse {
    errorCode: number;
}

export type UserDtoResponse = UserDtoSuccessResponse | UserDtoErrorResponse;
