import HttpError from "./HttpError";

export default class BadRequestError extends HttpError {
    httpCode = 400;

    constructor(data, error) {
        super(data, error);
    }
}
