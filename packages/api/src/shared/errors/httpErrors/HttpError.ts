export interface HttpErrorInterface {
    status: number;
    code?: number;
}

export default abstract class HttpError extends Error implements HttpErrorInterface {
    abstract status: number;
    code: number | undefined;
}
