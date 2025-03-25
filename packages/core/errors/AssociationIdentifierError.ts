import { BadRequestError } from "./httpErrors";

export class AssociationIdentifierError extends BadRequestError {
    constructor() {
        super("Invalid association identifier (rna, siren)");
    }
}
