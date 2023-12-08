import ChorusLineEntity from "../../../modules/providers/chorus/entities/ChorusLineEntity";
import { ConflictError } from "../httpErrors";

export class DuplicateIndexError extends ConflictError {
    constructor(message: string, public duplicates: ChorusLineEntity[]) {
        super(message);
    }
}
