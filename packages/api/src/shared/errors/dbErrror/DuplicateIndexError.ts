export class DuplicateIndexError extends Error {
    constructor(message: string, public entity?: unknown) {
        super(message)
    }
}