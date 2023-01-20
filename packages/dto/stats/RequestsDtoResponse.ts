import { ErrorResponse } from "../shared/ErrorResponse";

export interface StatsRequestDtoSuccessResponse {
    data: number;
}

export type StatsRequestDtoResponse = StatsRequestDtoSuccessResponse | ErrorResponse;
