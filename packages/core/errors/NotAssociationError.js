"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotAssociationError = void 0;
const dto_1 = require("dto");
const httpErrors_1 = require("./httpErrors");
class NotAssociationError extends httpErrors_1.BadRequestError {
    constructor() {
        super("Votre recherche pointe vers une entité qui n'est pas une association", dto_1.SearchCodeError.ID_NOT_ASSO);
    }
}
exports.NotAssociationError = NotAssociationError;
