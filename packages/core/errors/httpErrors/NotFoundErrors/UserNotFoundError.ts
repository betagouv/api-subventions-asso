import { ResetPasswordErrorCodes } from "../../../enums/ResetPasswordErrorCodes";
import { NotFoundError } from "./NotFoundError";

export class UserNotFoundError extends NotFoundError {
    constructor() {
        super("User not found", ResetPasswordErrorCodes.USER_NOT_FOUND);
    }
}
