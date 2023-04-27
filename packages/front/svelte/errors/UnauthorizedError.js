import StaticError from "./StaticError";

export default class UnauthorizedError extends StaticError {
    static httpCode = 401;
}
