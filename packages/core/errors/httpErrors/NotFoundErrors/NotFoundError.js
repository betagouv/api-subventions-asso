"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const HttpError_1 = __importDefault(require("../HttpError"));
class NotFoundError extends HttpError_1.default {
    constructor(message = "Resource Not Found", code) {
        super(message);
        this.status = 404;
        this.code = code;
    }
}
exports.NotFoundError = NotFoundError;
