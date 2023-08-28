import { LoginDtoErrorCodes } from "dto";
import { UnauthorizedError } from "./httpErrors";

export default class LoginError extends UnauthorizedError {
    constructor() {
        super("Invalid credentials", LoginDtoErrorCodes.EMAIL_OR_PASSWORD_NOT_MATCH);
    }
}
