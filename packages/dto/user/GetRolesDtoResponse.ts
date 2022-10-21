import { SuccessResponse } from "../shared/ResponseStatus";
import { UserDtoErrorResponse } from "./UserDtoResponse";

interface GetRolesSuccessResponse extends SuccessResponse {
    roles: string[]
}

export type GetRolesDtoResponse = GetRolesSuccessResponse | UserDtoErrorResponse;

