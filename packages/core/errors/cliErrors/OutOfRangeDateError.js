"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutOfRangeDateError = void 0;
class OutOfRangeDateError extends Error {
    constructor() {
        super(`You must provide a date lower or equal to the date of the day`);
    }
}
exports.OutOfRangeDateError = OutOfRangeDateError;
