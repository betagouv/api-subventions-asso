"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicateIndexError = void 0;
const httpErrors_1 = require("../httpErrors");
class DuplicateIndexError extends httpErrors_1.ConflictError {
    constructor(message, duplicates) {
        super(message);
        this.duplicates = duplicates;
    }
}
exports.DuplicateIndexError = DuplicateIndexError;
