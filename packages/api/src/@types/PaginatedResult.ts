export default interface PaginatedResult<T> {
    results: T;
    nbPages: number;
    page: number;
    total: number;
}
