"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = exports.BadRequestErrorCode = exports.BadRequestErrorMessage = void 0;
const HttpError_1 = __importDefault(require("./HttpError"));
exports.BadRequestErrorMessage = "Bad Request";
exports.BadRequestErrorCode = 400;
class BadRequestError extends HttpError_1.default {
    constructor(message = exports.BadRequestErrorMessage, code) {
        super(message);
        this.status = exports.BadRequestErrorCode;
        this.code = code;
    }
}
exports.BadRequestError = BadRequestError;
