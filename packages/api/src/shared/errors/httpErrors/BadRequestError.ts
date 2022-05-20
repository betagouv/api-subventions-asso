import HttpError from "./HttpError";

export class BadRequestError extends HttpError {
    status = 400
}