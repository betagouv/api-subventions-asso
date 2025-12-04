export class S3Error extends Error {
    constructor(message: string) {
        super(`S3 error: ${message}`);
    }
}
