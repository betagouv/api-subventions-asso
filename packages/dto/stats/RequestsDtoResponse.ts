

export interface StatsRequestDtoPositiveResponse {
    success: true,
    data: number,
}

export interface StatsRequestDtoNegativeResponse {
    success: false,
    message: string
}

export type StatsRequestDtoResponse = StatsRequestDtoPositiveResponse | StatsRequestDtoNegativeResponse;