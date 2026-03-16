import s3ClientAdapter from "../../dataProviders/s3/s3.adapter";
import { bufferToMulterFile } from "../../shared/helpers/FileHelper";
import { NotFoundError } from "core";

export class S3StorageService {
    /**
     * Delete all files of a user and upload a new one.
     * */
    public async uploadAndReplaceUserFile(file: Express.Multer.File, userId: string): Promise<string> {
        const existingFiles = await s3ClientAdapter.listFiles(userId);

        for (const fileKey of existingFiles) {
            await s3ClientAdapter.deleteFile(fileKey);
        }

        return this.uploadUserFile(file, userId);
    }

    public async uploadUserFile(file: Express.Multer.File, userId: string): Promise<string> {
        const key = `${userId}/${file.originalname}`;
        return s3ClientAdapter.uploadFile(file, key);
    }

    public async getUserFileDownloadUrl(userId: string, fileName: string): Promise<string> {
        const key = `${userId}/${fileName}`;
        return await s3ClientAdapter.getDownloadUrl(key);
    }

    public async deleteUserFile(userId: string, fileName: string): Promise<void> {
        const key = `${userId}/${fileName}`;
        return await s3ClientAdapter.deleteFile(key);
    }

    public async getUserFile(userId: string, fileName: string): Promise<Express.Multer.File> {
        const key = `${userId}/${fileName}`;
        const fileData = await s3ClientAdapter.getFile(key);

        if (!fileData) {
            throw new NotFoundError("No file found for this user");
        }

        return bufferToMulterFile(fileData.buffer, fileName, fileData.contentType);
    }
}

const s3FileService = new S3StorageService();

export default s3FileService;
