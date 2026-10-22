import HttpError from "./HttpError";

export default class ConflictError extends HttpError {
    httpCode = 409;

    constructor(data, error) {
        super(data, error);
    }
}
