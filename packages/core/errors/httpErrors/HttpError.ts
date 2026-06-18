export interface HttpErrorInterface {
    message: string;
    cause?: Record<string, string>;
}

export abstract class HttpError extends Error {
    abstract status: number;
}
