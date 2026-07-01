import { NotFoundError } from "./NotFoundError";

export class ResetTokenNotFoundError extends NotFoundError {
    constructor() {
        super("Reset token not found");
    }
}
