import ErreurReponse from "../shared/ErreurReponse";

export interface StatsRequestDtoSuccessResponse {
    data: number;
}

export type StatsRequestDtoResponse = StatsRequestDtoSuccessResponse | ErreurReponse;
