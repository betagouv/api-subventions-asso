import { ErrorResponse } from "../shared/ErrorResponse";

export interface StatsRequestsMedianDtoSuccessResponse {
    data: number;
}

export type StatsRequestsMedianDtoResponse = StatsRequestsMedianDtoSuccessResponse | ErrorResponse;
