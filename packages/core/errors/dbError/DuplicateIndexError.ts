import { ConflictError } from "../httpErrors";

export class DuplicateIndexError<T> extends ConflictError {
    constructor(message: string, public duplicates: T) {
        super(message);
    }
}
