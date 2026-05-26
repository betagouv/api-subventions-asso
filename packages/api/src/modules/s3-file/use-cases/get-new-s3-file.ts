import s3ClientAdapter from "../../../adapters/outputs/s3/s3.adapter";
import { S3Port } from "../../../adapters/outputs/s3/s3.port";
import { FileStatus } from "../@types/FileStatus";

/**
 * List new files present in the S3 bucket for a given path
 */
export class GetNewS3File {
    constructor(private adapter: S3Port) {}

    async execute(path) {
        const files = await this.adapter.listFiles(path);

        // Fetch tags for all files in parallel
        const filesWithStatus = (
            await Promise.all(
                files.map(async file => {
                    const tags = await this.adapter.getFileTags(file.path);
                    if (!tags["status"]) return null; // should not occur
                    return { ...file, status: tags["status"] as FileStatus };
                }),
            )
        ).filter(file => file !== null);

        const newFiles = filesWithStatus.filter(fileObj => fileObj?.status === FileStatus.NOT_IMPORTED);

        if (!newFiles) return [];

        return newFiles.map(file => ({ path: file.path, importDate: file.importDate }));
    }
}

const getNewS3File = new GetNewS3File(s3ClientAdapter);

export default getNewS3File;
