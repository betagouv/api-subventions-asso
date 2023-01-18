import { ErrorResponse, SuccessResponse } from "../shared/ResponseStatus";

export type UserCountByStatus = {
    admin: number;
    active: number;
    idle: number;
    inactive: number;
};

export interface UserCountByStatusSuccessResponse extends SuccessResponse {
    data: UserCountByStatus;
}

export type UsersByStatusResponseDto = UserCountByStatusSuccessResponse | ErrorResponse;
