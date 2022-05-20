import HttpError from "./HttpError";

export class BadRequestError extends HttpError {
    code = 400
}