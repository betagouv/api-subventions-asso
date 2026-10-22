import HttpError from "./HttpError";

export default class UnauthorizedError extends HttpError {
    httpCode = 401;

    constructor(data, error) {
        super(data, error);
    }
}
