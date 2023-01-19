import ErreurReponse from "../shared/ErreurReponse";

export interface StatsRequestsMedianDtoSuccessResponse {
    data: number;
}

export type StatsRequestsMedianDtoResponse = StatsRequestsMedianDtoSuccessResponse | ErreurReponse;
