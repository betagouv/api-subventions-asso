"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RnaSirenMatchError = void 0;
class RnaSirenMatchError extends Error {
    constructor() {
        super("Could not retrieve SIREN from RNA");
    }
}
exports.RnaSirenMatchError = RnaSirenMatchError;
