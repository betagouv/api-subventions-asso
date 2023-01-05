import HttpError from "./HttpError";

export class NotFoundError extends HttpError {
    constructor(message = "Resource Not Found") {
        super(message);
    }
    status = 404;
}
