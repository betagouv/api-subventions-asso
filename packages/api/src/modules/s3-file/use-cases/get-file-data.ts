import s3ClientAdapter from "../../../adapters/outputs/s3/s3.adapter";
import { S3Port } from "../../../adapters/outputs/s3/s3.port";

export class GetFileData {
    constructor(private adapter: S3Port) {}

    execute(path: string) {
        return this.adapter.getFile(path);
    }
}

const getFileData = new GetFileData(s3ClientAdapter);

export default getFileData;
