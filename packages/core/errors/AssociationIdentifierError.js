"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssociationIdentifierError = void 0;
const httpErrors_1 = require("./httpErrors");
class AssociationIdentifierError extends httpErrors_1.BadRequestError {
    constructor() {
        super("Invalid association identifier (rna, siren)");
    }
}
exports.AssociationIdentifierError = AssociationIdentifierError;
