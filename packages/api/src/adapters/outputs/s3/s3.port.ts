import FileTags from "../../../modules/s3-file/@types/FileTags";
import FileStreamPort from "../file-stream.port";

export interface S3Port extends FileStreamPort {
    uploadFile(file: Express.Multer.File, key: string): Promise<string>;
    getDownloadUrl(key: string, expiresIn): Promise<string>;
    deleteFile(key: string): Promise<void>;
    listFiles(prefix: string): Promise<{ path: string; importDate: Date }[]>;
    tagFile(key: string, tag: { name: string; value: FileTags }): Promise<void>;
    getFileTags(key: string): Promise<Record<string, string>>;
}
