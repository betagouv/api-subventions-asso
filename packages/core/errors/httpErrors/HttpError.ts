export interface HttpErrorInterface {
    message: string;
    code?: number;
    cause?: Record<string, string>;
}

export abstract class HttpError extends Error {
    abstract status: number;
    code?: number | undefined;
}
