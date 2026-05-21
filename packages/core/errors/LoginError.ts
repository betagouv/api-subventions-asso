import { LoginErrorCodes } from "../enums/LoginErrorCodes";
import { UnauthorizedError } from "./httpErrors";

export class LoginError extends UnauthorizedError {
    constructor() {
        super("Invalid credentials", LoginErrorCodes.EMAIL_OR_PASSWORD_NOT_MATCH);
    }
}
