import AsyncUseCase from "../../../@types/use-case/AsyncUseCase";
import { S3Port } from "../../../adapters/outputs/s3/s3.port";

export class UploadS3File implements AsyncUseCase<{ file: Buffer; key: string }, void> {
    constructor(private adapter: S3Port) {}

    async execute(input: { file: Buffer; key: string }) {
        this.adapter.uploadFile(input.file, input.key);
    }
}
