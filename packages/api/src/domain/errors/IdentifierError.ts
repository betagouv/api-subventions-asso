export class IdentifierError extends Error {
    constructor(public value: string) {
        super(`Invalid structure identifier: ${value}`);
    }
}
