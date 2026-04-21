import { MissingArgError } from "./MissingArgError";

export class MissingFilePathError extends MissingArgError {
    constructor() {
        super("filePath");
    }
}
