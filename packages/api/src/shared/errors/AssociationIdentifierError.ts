export default class AssociationIdentifierError extends Error {
    constructor() {
        super("Invalid association identifier (rna, siren)");
    }
}