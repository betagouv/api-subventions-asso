"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructureIdentifiersError = void 0;
const httpErrors_1 = require("./httpErrors");
class StructureIdentifiersError extends httpErrors_1.BadRequestError {
    constructor(type = undefined) {
        if (type)
            super(`Invalid ${type.toUpperCase()}`);
        else
            super("Invalid structure identifier (rna, siren or siret)");
    }
}
exports.StructureIdentifiersError = StructureIdentifiersError;
