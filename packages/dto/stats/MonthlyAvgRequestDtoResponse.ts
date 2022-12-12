import { ErrorResponse, SuccessResponse } from "../shared/ResponseStatus";

export type NbRequestsPerMonthRequest = { [month: string]: number };

export interface NbRequestsPerMonthRequestDtoSuccessResponse extends SuccessResponse {
    data: NbRequestsPerMonthRequest;
}

export type MonthlyAvgRequestDtoResponse = NbRequestsPerMonthRequestDtoSuccessResponse | ErrorResponse;
