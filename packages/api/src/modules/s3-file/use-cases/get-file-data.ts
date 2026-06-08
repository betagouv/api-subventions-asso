import { providersS3Adapter, scdlS3Adapter } from "../../../adapters/outputs/s3/s3.adapter";
import { S3Port } from "../../../adapters/outputs/s3/s3.port";

export class GetFileData {
    constructor(private adapter: S3Port) {}

    execute(path: string) {
        return this.adapter.getFile(path);
    }
}

export const getScdlFileData = new GetFileData(scdlS3Adapter);
export const getProvidersFileData = new GetFileData(providersS3Adapter);
