import { BadRequestError } from "./httpErrors";

export default class AssociationIdentifierError extends BadRequestError {
    constructor() {
        super("Invalid association identifier (rna, siren)");
    }
}
