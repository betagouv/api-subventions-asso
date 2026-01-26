import { HttpError } from "../HttpError";

export const UnprocessableEntityErrorMessage = "Unprocessable Entity";
export const UnprocessableEntityErrorCode = 422;

/**
 *  HTTP 422 Error - Unprocessable entity
 *  Used when the server understood the content type of the request content,
 *  and the syntax of the request content was correct,
 *  but it was unable to process the contained instructions.
 */
export class UnprocessableEntityError extends HttpError {
    status = UnprocessableEntityErrorCode;

    constructor(message = UnprocessableEntityErrorMessage, cause?: Record<string, unknown>, code?: number) {
        super(message, { cause });
        this.code = code;
    }
}
