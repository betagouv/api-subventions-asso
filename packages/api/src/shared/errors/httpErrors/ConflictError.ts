import HttpError from "./HttpError";

export const ConflictErrorMessage = "UnprocessableEntity";
export const ConflictErrorCode = 409;

export class ConflictError extends HttpError {
    constructor(message = ConflictErrorMessage) {
        super(message);
    }
    status = ConflictErrorCode;
}
