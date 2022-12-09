import { ErrorResponse, SuccessResponse } from "../shared/ResponseStatus";

export type MonthlyAvgRequest = { [month: string]: number };

export interface MonthlyAvgRequestDtoSuccessResponse extends SuccessResponse {
    data: MonthlyAvgRequest;
}

export type MonthlyAvgRequestDtoResponse = MonthlyAvgRequestDtoSuccessResponse | ErrorResponse;
