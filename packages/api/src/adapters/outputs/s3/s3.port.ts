import FileTags from "../../../modules/s3-file/@types/FileTags";

export interface S3Port {
    uploadFile(
        file: Buffer,
        key: string,
        options?: {
            contentType?: string;
            tag?: { name: string; value: string };
        },
    ): Promise<string>;
    getDownloadUrl(key: string, expiresIn): Promise<string>;
    deleteFile(key: string): Promise<void>;
    listFiles(prefix: string): Promise<{ path: string; importDate: Date }[]>;
    tagFile(key: string, tag: { name: string; value: FileTags }): Promise<void>;
    getFileTags(key: string): Promise<Record<string, string>>;
}
