import { ResetPasswordErrorCodes } from "dto";
import { NotFoundError } from "./NotFoundError";

export class UserNotFoundError extends NotFoundError {
    constructor() {
        super("User not found", ResetPasswordErrorCodes.USER_NOT_FOUND);
    }
}
