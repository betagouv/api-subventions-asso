export default class StructureIdentifiersError extends Error {
    constructor() {
        super("Invalid structure identifier (rna, siren or siret)");
    }
}