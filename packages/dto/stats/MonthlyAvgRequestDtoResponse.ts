import { ErrorResponse } from "../shared/ErrorResponse";

export type NbRequestsPerMonthRequest = { [month: string]: number };

export interface NbRequestsPerMonthRequestDtoSuccessResponse {
    data: NbRequestsPerMonthRequest;
}

export type MonthlyAvgRequestDtoResponse = NbRequestsPerMonthRequestDtoSuccessResponse | ErrorResponse;
