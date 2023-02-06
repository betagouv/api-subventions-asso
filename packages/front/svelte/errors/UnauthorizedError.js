import StaticError from "./StaticError";

export default class UnauthoziedError extends StaticError {
    static httpCode = 401;
}
