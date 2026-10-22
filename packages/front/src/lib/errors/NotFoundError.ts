import HttpError from "./HttpError";

export default class NotFoundError extends HttpError {
    httpCode = 404;

    constructor(data, error) {
        super(data, error);
    }
}
