import StaticError from "./StaticError";

export default class UnauthoziedError extends StaticError {
    static get httpCode() {
        return 401;
    }
}
