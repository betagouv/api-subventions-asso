import HttpError from "./HttpError";

export class NotFoundError extends HttpError {
    code = 404
}