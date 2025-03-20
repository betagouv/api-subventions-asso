"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginError = void 0;
const dto_1 = require("dto");
const httpErrors_1 = require("./httpErrors");
class LoginError extends httpErrors_1.UnauthorizedError {
    constructor() {
        super("Invalid credentials", dto_1.LoginDtoErrorCodes.EMAIL_OR_PASSWORD_NOT_MATCH);
    }
}
exports.LoginError = LoginError;
