import { ErrorResponse, SuccessResponse } from "../shared/ResponseStatus";

export type NbRequestsPerMonthRequest = { [month: string]: number };
export type TopAssociations = { nom: string; nbRequetes: number }[];

export interface NbRequestsPerMonthRequestDtoSuccessResponse extends SuccessResponse {
    data: NbRequestsPerMonthRequest;
}

export interface MonthlyAvgRequestDtoSuccessResponse extends SuccessResponse {
    data: TopAssociations;
}

export type MonthlyAvgRequestDtoResponse = NbRequestsPerMonthRequestDtoSuccessResponse | ErrorResponse;

export type TopAssociationsDtoResponse = MonthlyAvgRequestDtoSuccessResponse | ErrorResponse;
