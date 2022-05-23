import HttpError from "./HttpError";

export class NotFoundError extends HttpError {
    status = 404
}