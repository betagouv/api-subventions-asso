import { ResetPasswordErrorCodes } from "dto";
import { NotFoundError } from "./NotFoundError";

export class ResetTokenNotFoundError extends NotFoundError {
    constructor() {
        super("Reset token not found", ResetPasswordErrorCodes.RESET_TOKEN_NOT_FOUND);
    }
}
