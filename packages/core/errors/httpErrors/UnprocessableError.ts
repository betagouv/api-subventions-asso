import { HttpError } from "./HttpError";

export class UnprocessableError extends HttpError {
    constructor(message = "Unprocessable Content", code?: number) {
        super(message);
        this.code = code;
    }
    status = 422;
}
