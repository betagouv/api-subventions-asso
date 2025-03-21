"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatDateError = void 0;
class FormatDateError extends Error {
    constructor(format = "YYYY-MM-DD") {
        super(`You must provide a valid export date for this command | ${format} expected`);
    }
}
exports.FormatDateError = FormatDateError;
