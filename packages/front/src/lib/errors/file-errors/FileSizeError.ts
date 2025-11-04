export default class FileSizeError extends Error {
    constructor(
        public fileName: string,
        public maxSizeMb: number,
    ) {
        super(`File size validation failed for "${fileName}" with max size of ${maxSizeMb} MB`);
        this.name = "FileSizeError";
    }
}
