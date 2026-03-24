export type UserCountByStatus = {
    admin: number;
    active: number;
    idle: number;
    inactive: number;
};

export interface UserCountByStatusSuccessResponse {
    data: UserCountByStatus;
}

export type UsersByStatusResponseDto = UserCountByStatusSuccessResponse;
