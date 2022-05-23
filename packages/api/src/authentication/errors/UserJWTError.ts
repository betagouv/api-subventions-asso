import HttpError from "../../shared/errors/httpErrors/HttpError";

export default class UserJWTError extends HttpError {
    status = 401
}