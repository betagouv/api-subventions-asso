import { ConflictError } from "../httpErrors";

export class DuplicateIndexError extends ConflictError {
    constructor(message: string, public entity?: unknown) {
        super(message);
    }
}
