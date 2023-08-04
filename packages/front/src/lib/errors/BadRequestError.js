import StaticError from "./StaticError";

export default class BadRequestError extends StaticError {
    static httpCode = 400;
}
