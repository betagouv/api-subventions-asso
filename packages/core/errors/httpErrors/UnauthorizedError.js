"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = void 0;
const HttpError_1 = __importDefault(require("./HttpError"));
class UnauthorizedError extends HttpError_1.default {
    constructor(message = "Unauthorized", code) {
        super(message);
        this.status = 401;
        this.code = code;
    }
}
exports.UnauthorizedError = UnauthorizedError;
