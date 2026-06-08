import {
    DeleteObjectCommand,
    GetObjectCommand,
    GetObjectTaggingCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    PutObjectCommandInput,
    PutObjectTaggingCommand,
    S3Client,
    S3ClientConfig,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Error } from "./@errors/S3Error";
import { S3FileData } from "../../../@types/S3FileData";
import { S3Port } from "./s3.port";
import {
    S3_SCDL_BUCKET,
    S3_ENDPOINT,
    S3_REGION,
    S3_ACCESS_KEY,
    S3_SECRET_KEY,
    S3_PROVIDERS_BUCKET,
} from "../../../configurations/s3.conf";

export class S3Adapter implements S3Port {
    constructor(
        private s3Client: S3Client,
        private bucketName: string,
    ) {}

    /**
     *  Uploads a file to S3 bucket.
     * @param file - Express.Multer.File object containing file data.
     * @param key - Key of the file in S3 bucket (path).
     * @returns Key of the uploaded file.
     * */
    async uploadFile(file: Express.Multer.File, key: string, tag?: { name: string; value: string }): Promise<string> {
        try {
            const input: PutObjectCommandInput = {
                Bucket: this.bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            };

            if (tag && (!tag.name || !tag?.value)) throw new S3Error("Tag must have a name and value");
            if (tag && tag.name && tag.value) input.Tagging = `${tag.name}=${tag.value}`;

            const command = new PutObjectCommand(input);

            await this.s3Client.send(command);
            return key;
        } catch (error) {
            console.error(error);
            throw new S3Error("Failed to upload file");
        }
    }

    /**
     * Generates a signed download URL for a file in S3 bucket.
     * @param key - Key of the file in S3 bucket (path).
     * @param expiresIn - URL expiration time in seconds (default: 240).
     * @returns Signed URL for downloading the file.
     */
    async getDownloadUrl(key: string, expiresIn: number = 240): Promise<string> {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });

            return await getSignedUrl(this.s3Client, command, { expiresIn });
        } catch (error) {
            console.error(error);
            throw new S3Error("Failed to generate download URL");
        }
    }

    /**
     * Deletes a file from S3 bucket.
     * @param key - Key of the file to delete in S3 bucket (path).
     * @returns Promise that resolves when file is deleted.
     */
    async deleteFile(key: string): Promise<void> {
        try {
            const command = new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });

            await this.s3Client.send(command);
        } catch (error) {
            console.error(error);
            throw new S3Error("Failed to delete file");
        }
    }

    /**
     * Retrieves a file from S3 bucket with its metadata.
     * @param key - Key of the file in S3 bucket (path).
     * @returns File data object containing buffer, content type and key, or null if not found.
     */
    async getFile(key: string): Promise<S3FileData | null> {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });

            const response = await this.s3Client.send(command);

            if (!response.Body) {
                return null;
            }

            const stream = response.Body as NodeJS.ReadableStream;
            const chunks: Buffer[] = [];

            for await (const chunk of stream) {
                const buffer = chunk as Buffer;
                chunks.push(buffer);
            }

            return {
                buffer: Buffer.concat(chunks),
                contentType: response.ContentType,
                key,
            };
        } catch (error) {
            console.error(error);
            throw new S3Error("Failed to get file");
        }
    }

    async getFileTags(key: string) {
        try {
            const command = new GetObjectTaggingCommand({
                Bucket: this.bucketName,
                Key: key,
            });

            const { TagSet } = await this.s3Client.send(command);

            if (!TagSet) return {};

            return TagSet?.reduce(
                (tags, tag) => {
                    if (!tag.Key || !tag.Value) return tags;
                    tags[tag.Key] = tag.Value;
                    return tags;
                },
                {} as Record<string, string>,
            );
        } catch (error) {
            console.log(error);
            throw new S3Error("Failed to retrieve file tag information");
        }
    }

    /**
     * Lists all files in S3 bucket with given prefix.
     * @param prefix - Prefix to filter files (folder path).
     * @returns Array of file keys matching the prefix.
     */
    async listFiles(prefix: string) {
        try {
            const command = new ListObjectsV2Command({
                Bucket: this.bucketName,
                Prefix: prefix,
            });

            const response = await this.s3Client.send(command);
            return response.Contents?.map(obj => ({ path: obj.Key!, importDate: obj.LastModified! })) || [];
        } catch (error) {
            console.error(error);
            throw new S3Error("Failed to list files");
        }
    }

    async tagFile(key: string, tag: { name: string; value: string }): Promise<void> {
        try {
            const command = new PutObjectTaggingCommand({
                Bucket: this.bucketName,
                Key: key,
                Tagging: { TagSet: [{ Key: tag.name, Value: tag.value }] },
            });

            await this.s3Client.send(command);
        } catch (error) {
            console.error(error);
            throw new S3Error("Failed to add tag to file");
        }
    }
}

const DEFAULT_CLIENT = new S3Client({
    endpoint: S3_ENDPOINT,
    region: S3_REGION,
    credentials: {
        accessKeyId: S3_ACCESS_KEY,
        secretAccessKey: S3_SECRET_KEY,
    },
    forcePathStyle: true,
} as S3ClientConfig);

export const scdlS3Adapter = new S3Adapter(DEFAULT_CLIENT, S3_SCDL_BUCKET);

export const providersS3Adapter = new S3Adapter(DEFAULT_CLIENT, S3_PROVIDERS_BUCKET);
