import { ConflictError } from "core";

export class DuplicateIndexError<T> extends ConflictError {
    constructor(message: string, public duplicates: T) {
        super(message);
    }
}
