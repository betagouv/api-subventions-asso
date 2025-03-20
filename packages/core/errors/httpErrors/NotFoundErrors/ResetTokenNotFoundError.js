"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetTokenNotFoundError = void 0;
const dto_1 = require("dto");
const NotFoundError_1 = require("./NotFoundError");
class ResetTokenNotFoundError extends NotFoundError_1.NotFoundError {
    constructor() {
        super("Reset token not found", dto_1.ResetPasswordErrorCodes.RESET_TOKEN_NOT_FOUND);
    }
}
exports.ResetTokenNotFoundError = ResetTokenNotFoundError;
