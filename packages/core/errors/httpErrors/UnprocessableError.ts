import { HttpError } from "./HttpError";

export class UnprocessableError extends HttpError {
    constructor(message = "Unprocessable Content") {
        super(message);
    }
    status = 422;
}
