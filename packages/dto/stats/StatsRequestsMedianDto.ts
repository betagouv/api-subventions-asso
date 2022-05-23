export interface StatsRequestsMedianDtoPositiveResponse {
    success: true,
    data: number
}

export interface StatsRequestsMedianDtoNegativeResponse {
    success: false,
    message: string
}

export type StatsRequestsMedianDtoResponse = StatsRequestsMedianDtoNegativeResponse | StatsRequestsMedianDtoPositiveResponse;