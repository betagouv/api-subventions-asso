export interface HttpErrorInterface {
    message: string;
    code?: number;
}

export abstract class HttpError extends Error {
    abstract status: number;
    code: number | undefined;
}
