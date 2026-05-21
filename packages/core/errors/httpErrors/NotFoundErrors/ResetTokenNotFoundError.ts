import { ResetPasswordErrorCodes } from "../../../enums/ResetPasswordErrorCodes";
import { NotFoundError } from "./NotFoundError";

export class ResetTokenNotFoundError extends NotFoundError {
    constructor() {
        super("Reset token not found", ResetPasswordErrorCodes.RESET_TOKEN_NOT_FOUND);
    }
}
