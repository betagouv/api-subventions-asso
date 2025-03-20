import { HttpError } from "./HttpError";

export class ForbiddenError extends HttpError {
    constructor(message = "Forbidden", code?: number) {
        super(message);
        this.code = code;
    }
    status = 403;
}
