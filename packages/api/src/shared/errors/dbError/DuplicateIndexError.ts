import ChorusLineEntity from "../../../modules/providers/chorus/entities/ChorusLineEntity";

export class DuplicateIndexError extends Error {
    constructor(message: string, public duplicates: ChorusLineEntity[]) {
        super(message);
    }
}
