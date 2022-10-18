import { ErrorResponse, SuccessResponse } from "../shared/ResponseStatus";

interface GetRolesSuccessResponse extends SuccessResponse {
    roles: string[]
}

export type GetRolesDtoResponse = GetRolesSuccessResponse | ErrorResponse;

