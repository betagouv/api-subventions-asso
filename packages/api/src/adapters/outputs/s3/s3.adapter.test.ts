import { mockClient } from "aws-sdk-client-mock";
import {
    DeleteObjectCommand,
    GetObjectCommand,
    GetObjectTaggingCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    PutObjectTaggingCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { S3Adapter } from "./s3.adapter";
import { S3Error } from "./@errors/S3Error";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";
import { FileStatus } from "../../../modules/s3-file/@types/FileStatus";

const s3Mock = mockClient(S3Client);
const s3Bucket = "S3_BUCKET";

jest.mock("@aws-sdk/s3-request-presigner", () => ({
    getSignedUrl: jest.fn(),
}));

const mockGetSignedUrl = getSignedUrl as jest.MockedFunction<typeof getSignedUrl>;

describe("S3 Port", () => {
    let s3Port: S3Adapter;

    const file = {
        originalname: "test-file.csv",
        mimetype: "text/csv",
        buffer: Buffer.from("test-file-content"),
    } as Express.Multer.File;

    const fileKey = "test-file-key";

    beforeEach(() => {
        s3Mock.reset();
        s3Port = new S3Adapter(s3Mock as unknown as S3Client, s3Bucket);
    });

    describe("uploadFile", () => {
        it("calls S3Client.send with correct params", async () => {
            const expectedResp = { ETag: "etag-test" };
            s3Mock.on(PutObjectCommand).resolves(expectedResp);

            const result = await s3Port.uploadFile(file, fileKey);

            expect(result).toEqual(fileKey);
            const putObjectCall = s3Mock.commandCalls(PutObjectCommand)[0];
            expect(putObjectCall.args[0].input).toEqual({
                Bucket: s3Bucket,
                Key: fileKey,
                Body: file.buffer,
                ContentType: file.mimetype,
            });
        });

        it("throw S3Error if S3Client.send throws", async () => {
            s3Mock.on(PutObjectCommand).rejects(new Error("S3 error"));

            await expect(s3Port.uploadFile(file, fileKey)).rejects.toThrow(new S3Error("Failed to upload file"));
        });
    });

    describe("getDownloadUrl", () => {
        it("generate download url", async () => {
            const expectedUrl = "https://presigned-url.example.com/test-file-key";

            mockGetSignedUrl.mockResolvedValueOnce(expectedUrl);

            const result = await s3Port.getDownloadUrl(fileKey);

            expect(result).toEqual(expectedUrl);
        });

        it("calls getSignedUrl with correct params", async () => {
            const expectedUrl = "https://presigned-url.example.com/test-file-key";

            mockGetSignedUrl.mockResolvedValueOnce(expectedUrl);

            await s3Port.getDownloadUrl(fileKey);

            expect(mockGetSignedUrl).toHaveBeenCalledWith(s3Mock, expect.any(GetObjectCommand), {
                expiresIn: 240,
            });
        });

        it("throw S3Error if getSignedUrl rejects", async () => {
            mockGetSignedUrl.mockRejectedValueOnce(new Error("S3 error"));

            await expect(s3Port.getDownloadUrl(fileKey)).rejects.toThrow(
                new S3Error("Failed to generate download URL"),
            );
        });
    });

    describe("deleteFile", () => {
        it("calls S3Client.send with correct params", async () => {
            s3Mock.on(DeleteObjectCommand).resolves({});

            await s3Port.deleteFile(fileKey);

            const deleteObjectCall = s3Mock.commandCalls(DeleteObjectCommand)[0];
            expect(deleteObjectCall.args[0].input).toEqual({
                Bucket: s3Bucket,
                Key: fileKey,
            });
        });

        it("throw S3Error if S3Client.send throws", async () => {
            s3Mock.on(DeleteObjectCommand).rejects(new Error("S3 error"));

            await expect(s3Port.deleteFile(fileKey)).rejects.toThrow(new S3Error("Failed to delete file"));
        });
    });

    describe("getFile", () => {
        it("calls S3Client.send with correct params", async () => {
            s3Mock.on(GetObjectCommand).resolves({});

            await s3Port.getFile(fileKey);

            const getObjectCall = s3Mock.commandCalls(GetObjectCommand)[0];
            expect(getObjectCall.args[0].input).toEqual({
                Bucket: s3Bucket,
                Key: fileKey,
            });
        });

        it("throw S3Error if S3Client.send throws", async () => {
            s3Mock.on(GetObjectCommand).rejects(new Error("S3 error"));

            await expect(s3Port.getFile(fileKey)).rejects.toThrow(new S3Error("Failed to get file"));
        });

        it("return null if no response body", async () => {
            s3Mock.on(GetObjectCommand).resolves({ Body: undefined });

            const data = await s3Port.getFile(fileKey);

            expect(data).toBeNull();
        });

        it("return file data with buffer and content type", async () => {
            const key = "test.csv";
            const fileContent = "Test content";
            const contentType = "text/csv";

            const mockStream = new Readable();
            mockStream.push(Buffer.from(fileContent));
            mockStream.push(null);

            s3Mock.on(GetObjectCommand).resolves({
                Body: mockStream as never,
                ContentType: contentType,
            });

            const result = await s3Port.getFile(key);

            expect(result).toEqual({
                buffer: Buffer.from(fileContent),
                contentType: contentType,
                key: key,
            });
        });
    });

    describe("listFiles", () => {
        it("calls S3Client.send with correct params", async () => {
            const expectedResp = { Contents: [] };
            s3Mock.on(ListObjectsV2Command).resolves(expectedResp);

            await s3Port.listFiles("prefix");

            const listObjectCall = s3Mock.commandCalls(ListObjectsV2Command)[0];
            expect(listObjectCall.args[0].input).toEqual({
                Bucket: s3Bucket,
                Prefix: "prefix",
            });
        });

        it("return correct list of keys", async () => {
            const PATH_1 = "path/to/file1.csv",
                PATH_2 = "path/to/file2.csv",
                IMPORT_DATE_1 = new Date("2026-05-20"),
                IMPORT_DATE_2 = new Date("2026-05-27");

            const expectedResp = {
                Contents: [
                    { Key: PATH_1, LastModified: IMPORT_DATE_1 },
                    { Key: PATH_2, LastModified: IMPORT_DATE_2 },
                ],
            };

            s3Mock.on(ListObjectsV2Command).resolves(expectedResp);

            const result = await s3Port.listFiles("prefix");

            expect(result).toEqual([
                { path: PATH_1, importDate: IMPORT_DATE_1 },
                { path: PATH_2, importDate: IMPORT_DATE_2 },
            ]);
        });

        it("throw S3Error if S3Client.send throws", async () => {
            s3Mock.on(ListObjectsV2Command).rejects(new Error("S3 error"));

            await expect(s3Port.listFiles("prefix")).rejects.toThrow(new S3Error("Failed to list files"));
        });
    });

    describe("tagFile", () => {
        const TAG = { name: "status", value: FileStatus.IMPORTED };

        it("calls S3Client.send with correct params", async () => {
            s3Mock.on(PutObjectTaggingCommand).resolves({});

            await s3Port.tagFile(fileKey, TAG);

            const commandCall = s3Mock.commandCalls(PutObjectTaggingCommand)[0];
            expect(commandCall.args[0].input).toEqual({
                Bucket: s3Bucket,
                Key: fileKey,
                Tagging: { TagSet: [{ Key: TAG.name, Value: TAG.value }] },
            });
        });

        it("throw S3Error if S3Client.send throws", async () => {
            s3Mock.on(PutObjectTaggingCommand).rejects(new Error("S3 error"));

            await expect(s3Port.tagFile(fileKey, TAG)).rejects.toThrow(new S3Error("Failed to add tag to file"));
        });
    });

    describe("getFileTags", () => {
        const TAG_SET = { Key: "status", Value: FileStatus.IMPORTED };
        it("calls S3Client.send with correct params", async () => {
            s3Mock.on(GetObjectTaggingCommand).resolves({});

            await s3Port.getFileTags(fileKey);

            const commandCall = s3Mock.commandCalls(GetObjectTaggingCommand)[0];
            expect(commandCall.args[0].input).toEqual({
                Bucket: s3Bucket,
                Key: fileKey,
            });
        });

        it("throw S3Error if S3Client.send throws", async () => {
            s3Mock.on(GetObjectTaggingCommand).rejects(new Error("S3 error"));

            await expect(s3Port.getFileTags(fileKey)).rejects.toThrow(
                new S3Error("Failed to retrieve file tag information"),
            );
        });

        it("returns well formated tags", async () => {
            s3Mock.on(GetObjectTaggingCommand).resolves({ TagSet: [TAG_SET] });

            const expected = { [TAG_SET.Key]: TAG_SET.Value };
            const actual = await s3Port.getFileTags(fileKey);

            expect(actual).toEqual(expected);
        });
    });
});
