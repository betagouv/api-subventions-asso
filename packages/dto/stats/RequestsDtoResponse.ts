import { ErrorResponse, SuccessResponse } from "../shared/ResponseStatus";

export interface StatsRequestDtoSuccessResponse extends SuccessResponse {
    data: number
}

export type StatsRequestDtoResponse = StatsRequestDtoSuccessResponse | ErrorResponse;