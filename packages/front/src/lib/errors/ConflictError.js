import StaticError from "./StaticError";

export default class ConflictError extends StaticError {
    static httpCode = 409;

    constructor(data, error) {
        super(data, error);
        this.httpCode = ConflictError.httpCode;
    }
}
