import StaticError from "./StaticError";

export default class NotFoundError extends StaticError {
    static httpCode = 404;
}
