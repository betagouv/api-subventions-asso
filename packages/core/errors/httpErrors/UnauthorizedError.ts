import { HttpError } from "./HttpError";

export class UnauthorizedError extends HttpError {
    constructor(message = "Unauthorized", code?: number) {
        super(message);
        this.code = code;
    }
    status = 401;
}
