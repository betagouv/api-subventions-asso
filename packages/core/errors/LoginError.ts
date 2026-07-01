import { UnauthorizedError } from "./httpErrors";

export class LoginError extends UnauthorizedError {
    constructor() {
        super("Invalid credentials");
    }
}
