export class NoSireneImportError extends Error {
    constructor() {
        super();
        this.message = "You must import data from Sirene Unité Légale before Rna";
    }
}
