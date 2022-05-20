export interface HttpErrorInterface {
    status: number
}

export default abstract class HttpError extends Error implements HttpErrorInterface  {
    abstract status: number
}