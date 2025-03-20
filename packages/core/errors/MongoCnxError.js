"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoCnxError = void 0;
class MongoCnxError extends Error {
    constructor() {
        super("Connexion to DB lost");
    }
}
exports.MongoCnxError = MongoCnxError;
