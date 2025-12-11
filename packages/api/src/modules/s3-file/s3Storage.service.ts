import s3ClientPort from "../../dataProviders/s3/s3.port";
import { bufferToMulterFile } from "../../shared/helpers/FileHelper";
import { NotFoundError } from "core";

export class S3StorageService {
    /**
     * Delete all files of a user and upload a new one.
     * */
    public async uploadAndReplaceUserFile(file: Express.Multer.File, userId: string): Promise<string> {
        const existingFiles = await s3ClientPort.listFiles(userId);

        for (const fileKey of existingFiles) {
            await s3ClientPort.deleteFile(fileKey);
        }

        return this.uploadUserFile(file, userId);
    }

    public async uploadUserFile(file: Express.Multer.File, userId: string): Promise<string> {
        const key = `${userId}/${file.originalname}`;
        return s3ClientPort.uploadFile(file, key);
    }

    public async getUserFileDownloadUrl(userId: string, fileName: string): Promise<string> {
        const key = `${userId}/${fileName}`;
        return await s3ClientPort.getDownloadUrl(key);
    }

    public async deleteUserFile(userId: string, fileName: string): Promise<void> {
        const key = `${userId}/${fileName}`;
        return await s3ClientPort.deleteFile(key);
    }

    public async getUserFile(userId: string, fileName: string): Promise<Express.Multer.File> {
        const key = `${userId}/${fileName}`;
        const fileData = await s3ClientPort.getFile(key);

        if (!fileData) {
            throw new NotFoundError("No file found for this user");
        }

        return bufferToMulterFile(fileData.buffer, fileName, fileData.contentType);
    }
}

const s3FileService = new S3StorageService();

export default s3FileService;
