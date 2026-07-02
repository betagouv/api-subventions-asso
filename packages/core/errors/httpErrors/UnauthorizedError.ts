import { HttpError } from "./HttpError";

export class UnauthorizedError extends HttpError {
    constructor(message = "Unauthorized") {
        super(message);
    }
    status = 401;
}
