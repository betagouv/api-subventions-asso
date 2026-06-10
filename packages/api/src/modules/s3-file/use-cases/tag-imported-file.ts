import { providersS3Adapter } from "../../../adapters/outputs/s3/s3.adapter";
import { S3Port } from "../../../adapters/outputs/s3/s3.port";

export class TagImportedFile {
    constructor(private s3adapter: S3Port) {}

    execute(key: string) {
        return this.s3adapter.tagFile(key, { name: "status", value: "imported" });
    }
}

const tagImportedFile = new TagImportedFile(providersS3Adapter);
export default tagImportedFile;
