import { SearchErrorCodes } from "../enums/SearchErrorCodes";
import { UnprocessableError } from "./httpErrors/UnprocessableError";

export class NotAssociationError extends UnprocessableError {
    constructor() {
        super("Votre recherche pointe vers une entité qui n'est pas une association", SearchErrorCodes.ID_NOT_ASSO);
    }
}
