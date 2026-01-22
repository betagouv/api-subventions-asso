import { HttpError } from "../HttpError";

export const UnprocessableEntityErrorMessage = "Unprocessable Entity";
export const UnprocessableEntityErrorCode = 422;

export class UnprocessableEntityError extends HttpError {
    status = UnprocessableEntityErrorCode;

    constructor(message = UnprocessableEntityErrorMessage, cause?: Record<string, string>, code?: number) {
        super(message, { cause });
        this.code = code;
    }
}
