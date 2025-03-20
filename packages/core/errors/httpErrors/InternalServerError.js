"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.InternalServerErrorCode = exports.InternalServerErrorMessage = void 0;
const HttpError_1 = __importDefault(require("./HttpError"));
exports.InternalServerErrorMessage = "Internal Server Error";
exports.InternalServerErrorCode = 500;
class InternalServerError extends HttpError_1.default {
    constructor(message = exports.InternalServerErrorMessage, code) {
        super(message);
        this.status = exports.InternalServerErrorCode;
        this.code = code;
    }
}
exports.InternalServerError = InternalServerError;
