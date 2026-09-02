import fs from "fs";

export class RemoveFile {
    execute(filePath) {
        return fs.promises.unlink(filePath);
    }
}
