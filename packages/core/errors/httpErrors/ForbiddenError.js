"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = void 0;
const HttpError_1 = __importDefault(require("./HttpError"));
class ForbiddenError extends HttpError_1.default {
    constructor(message = "Forbidden", code) {
        super(message);
        this.status = 403;
        this.code = code;
    }
}
exports.ForbiddenError = ForbiddenError;
