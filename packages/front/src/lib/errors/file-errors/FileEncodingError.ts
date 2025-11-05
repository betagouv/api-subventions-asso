export default class FileEncodingError extends Error {
    constructor(
        public fileName: string,
        public supportedEncodings: string[],
    ) {
        super(`File encoding validation failed for "${fileName}". Only ${supportedEncodings.join(", ")} are supported`);
        this.name = "FileEncodingError";
    }
}
