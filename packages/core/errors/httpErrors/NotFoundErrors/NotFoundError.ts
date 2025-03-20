import { HttpError } from "../HttpError";

export class NotFoundError extends HttpError {
    constructor(message = "Resource Not Found", code?: number) {
        super(message);
        this.code = code;
    }
    status = 404;
}
