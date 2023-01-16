import { ErrorResponse, SuccessResponse } from "../shared/ResponseStatus";

export type UsersByStatus = {
    admin: number;
    active: number;
    idle: number;
    inactive: number;
};

export interface UsersByStatusSuccessResponse extends SuccessResponse {
    data: UsersByStatus;
}

export type UsersByStatusResponseDto = UsersByStatusSuccessResponse | ErrorResponse;
