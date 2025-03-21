import { HttpError } from "./HttpError";

export const BadRequestErrorMessage = "Bad Request";
export const BadRequestErrorCode = 400;

export class BadRequestError extends HttpError {
    constructor(message = BadRequestErrorMessage, code?: number) {
        super(message);
        this.code = code;
    }
    status = BadRequestErrorCode;
}
