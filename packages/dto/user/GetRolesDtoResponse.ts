import { UserDtoErrorResponse } from "./UserDtoResponse";

interface GetRolesSuccessResponse {
    roles: string[];
}

export type GetRolesDtoResponse = GetRolesSuccessResponse | UserDtoErrorResponse;
