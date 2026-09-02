import { S3Adapter, scdlS3Adapter } from "../../adapters/outputs/s3/s3.adapter";
import { bufferToMulterFile } from "../../shared/helpers/FileHelper";
import fs from "fs";
import DownloadFile from "../../usecases/download-file";

export class S3StorageService {
    constructor(
        private s3Adapter: S3Adapter,
        private downloadFile: DownloadFile,
    ) {}

    /**
     * Delete all files of a user and upload a new one.
     * */
    public async uploadAndReplaceUserFile(file: Express.Multer.File, userId: string): Promise<string> {
        const existingFiles = await this.s3Adapter.listFiles(userId);

        for (const file of existingFiles) {
            await this.s3Adapter.deleteFile(file.path);
        }

        return this.uploadUserFile(file, userId);
    }

    public async uploadUserFile(file: Express.Multer.File, userId: string): Promise<string> {
        const key = `${userId}/${file.originalname}`;
        return this.s3Adapter.uploadFile(file, key);
    }

    public async getUserFileDownloadUrl(userId: string, fileName: string): Promise<string> {
        const key = `${userId}/${fileName}`;
        return await this.s3Adapter.getDownloadUrl(key);
    }

    public async deleteUserFile(userId: string, fileName: string): Promise<void> {
        const key = `${userId}/${fileName}`;
        return await this.s3Adapter.deleteFile(key);
    }

    public async getUserFile(userId: string, fileName: string): Promise<Express.Multer.File> {
        const key = `${userId}/${fileName}`;

        const fileInfo = await this.downloadFile.execute(key);

        const buffer = await fs.promises.readFile(fileInfo.filePath);

        return bufferToMulterFile(buffer, fileName, fileInfo.contentType);
    }
}

const s3FileService = new S3StorageService(scdlS3Adapter, new DownloadFile(scdlS3Adapter));

export default s3FileService;
