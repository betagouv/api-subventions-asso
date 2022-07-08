import { ObjectId } from "mongodb";
import { SuccessResponse } from "../shared/ResponseStatus";

export default interface UserDto {
    _id?: string | ObjectId,
    email: string,
    roles: string[],
    active: boolean
}

export interface UserWithTokenDto extends UserDto {
    resetToken?: string,
    resetTokenDate?: Date
}

export interface GetUserSuccessResponseDto extends SuccessResponse {
    user: UserDto
}