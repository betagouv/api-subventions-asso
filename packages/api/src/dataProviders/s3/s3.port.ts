import { S3FileData } from "../../@types/S3FileData";

export interface S3Port {
    uploadFile(file: Express.Multer.File, key: string): Promise<string>;
    getDownloadUrl(key: string, expiresIn): Promise<string>;
    deleteFile(key: string): Promise<void>;
    getFile(key: string): Promise<S3FileData | null>;
    listFiles(prefix: string): Promise<string[]>;
}
