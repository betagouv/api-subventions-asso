import {
    DeleteObjectCommand,
    GetObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    S3Client,
    S3ClientConfig,
} from "@aws-sdk/client-s3";

import { S3_ACCESS_KEY, S3_REGION, S3_BUCKET, S3_ENDPOINT, S3_SECRET_KEY } from "../../configurations/s3.conf";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Error } from "./s3Errors";
import { S3FileData } from "../../@types/S3FileData";

export class S3Port {
    s3Client: S3Client;

    constructor() {
        this.s3Client = new S3Client({
            endpoint: S3_ENDPOINT,
            region: S3_REGION,
            credentials: {
                accessKeyId: S3_ACCESS_KEY,
                secretAccessKey: S3_SECRET_KEY,
            },
            forcePathStyle: true, // to MiniIo bucket in path, not in subdomain
        } as S3ClientConfig);
    }

    async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
        try {
            const command = new PutObjectCommand({
                Bucket: S3_BUCKET,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            });

            await this.s3Client.send(command);
            return key;
        } catch (error) {
            console.error(error);
            throw new S3Error("Failed to upload file");
        }
    }

    async getDownloadUrl(key: string, expiresIn: number = 60): Promise<string> {
        try {
            const command = new GetObjectCommand({
                Bucket: S3_BUCKET,
                Key: key,
            });

            return await getSignedUrl(this.s3Client, command, { expiresIn });
        } catch (error) {
            console.error(error);
            throw new S3Error("Failed to generate download URL");
        }
    }

    async deleteFile(key: string): Promise<void> {
        try {
            const command = new DeleteObjectCommand({
                Bucket: S3_BUCKET,
                Key: key,
            });

            await this.s3Client.send(command);
        } catch (error) {
            console.error(error);
            throw new S3Error("Failed to delete file");
        }
    }

    async getFile(key: string): Promise<S3FileData | null> {
        try {
            const command = new GetObjectCommand({
                Bucket: S3_BUCKET,
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

    async listFiles(prefix: string): Promise<string[]> {
        try {
            const command = new ListObjectsV2Command({
                Bucket: S3_BUCKET,
                Prefix: prefix,
            });

            const response = await this.s3Client.send(command);
            return response.Contents?.map(obj => obj.Key!) || [];
        } catch (error) {
            console.error(error);
            throw new S3Error("Failed to list files");
        }
    }
}

const s3ClientPort = new S3Port();

export default s3ClientPort;
