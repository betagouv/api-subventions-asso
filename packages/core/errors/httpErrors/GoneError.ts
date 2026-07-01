import { HttpError } from "./HttpError";

export class GoneError extends HttpError {
    constructor(message = "Gone") {
        super(message);
    }
    status = 410;
}
