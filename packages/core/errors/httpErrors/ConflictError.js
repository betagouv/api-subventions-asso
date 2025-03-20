"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = exports.ConflictErrorCode = exports.ConflictErrorMessage = void 0;
const HttpError_1 = __importDefault(require("./HttpError"));
exports.ConflictErrorMessage = "UnprocessableEntity";
exports.ConflictErrorCode = 409;
class ConflictError extends HttpError_1.default {
    constructor(message = exports.ConflictErrorMessage, code) {
        super(message);
        this.status = exports.ConflictErrorCode;
        this.code = code;
    }
}
exports.ConflictError = ConflictError;
