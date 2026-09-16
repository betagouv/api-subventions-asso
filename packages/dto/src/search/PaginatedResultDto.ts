export interface PaginatedResultDto<T> {
    results: T;
    nbPages: number;
    page: number;
    total: number;
}
