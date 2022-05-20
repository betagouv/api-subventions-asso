export interface HttpErrorInterface {
    code: number
}

export default abstract class HttpError extends Error implements HttpErrorInterface  {
    abstract code: number
}