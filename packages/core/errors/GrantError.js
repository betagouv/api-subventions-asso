"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RnaOnlyError = void 0;
class RnaOnlyError extends Error {
    constructor(rna) {
        super(`We could not find any SIREN for the given RNA : ${rna}`);
    }
}
exports.RnaOnlyError = RnaOnlyError;
