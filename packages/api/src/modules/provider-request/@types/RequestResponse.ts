export interface RequestResponse<T> {
    data: T;
    status: number;
    statusText: string;
}
