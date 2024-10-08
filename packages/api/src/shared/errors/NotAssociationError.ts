import { SearchCodeError } from "dto";
import { BadRequestError } from "./httpErrors";

export default class NotAssociationError extends BadRequestError {
    constructor() {
        super("Votre recherche pointe vers une entité qui n'est pas une association", SearchCodeError.ID_NOT_ASSO);
    }
}
