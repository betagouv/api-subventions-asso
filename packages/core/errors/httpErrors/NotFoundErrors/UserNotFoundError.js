"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserNotFoundError = void 0;
const dto_1 = require("dto");
const NotFoundError_1 = require("./NotFoundError");
class UserNotFoundError extends NotFoundError_1.NotFoundError {
    constructor() {
        super("User not found", dto_1.ResetPasswordErrorCodes.USER_NOT_FOUND);
    }
}
exports.UserNotFoundError = UserNotFoundError;
