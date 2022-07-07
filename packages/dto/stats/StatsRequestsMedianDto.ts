import { ErrorResponse } from "../shared/ResponseStatus";

export interface StatsRequestsMedianDtoSuccessResponse {
    success: true,
    data: number
}

export type StatsRequestsMedianDtoResponse = StatsRequestsMedianDtoSuccessResponse | ErrorResponse;