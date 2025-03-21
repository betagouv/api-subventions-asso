export class RnaSirenMatchError extends Error {
    constructor() {
        super("Could not retrieve SIREN from RNA");
    }
}
