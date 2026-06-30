import { S3Port } from "../../../adapters/outputs/s3/s3.port";

export class TagNewFile {
    constructor(private s3adapter: S3Port) {}

    execute(key: string) {
        return this.s3adapter.tagFile(key, { name: "status", value: "not-imported" });
    }
}
