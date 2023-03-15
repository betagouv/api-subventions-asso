export interface HttpErrorInterface {
    message: string;
    code?: number;
}

export default abstract class HttpError extends Error {
    abstract status: number;
    code: number | undefined;
}
