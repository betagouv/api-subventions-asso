import HttpError from "./HttpError";

export const InternalServerErrorMessage = "Internal Server Error";
export const InternalServerErrorCode = 500;

export class InternalServerError extends HttpError {
    constructor(message = InternalServerErrorMessage) {
        super(message);
    }
    status = InternalServerErrorCode;
}
