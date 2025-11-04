export default class FileFormatError extends Error {
    constructor(public fileName: string) {
        super(`File format validation failed for "${fileName}"`);
        this.name = "FileFormatError";
    }
}
