import { ConflictError } from "./httpErrors";

export class MultipleAssociationsError extends ConflictError {
    constructor() {
        super("Multiple associations found with this identifier, please use a more specific one");
    }
}
