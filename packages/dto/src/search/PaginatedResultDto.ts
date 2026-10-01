export interface PaginatedResultDto<T> {
    resultats: T;
    nbPages: number;
    page: number;
    total: number;
}
