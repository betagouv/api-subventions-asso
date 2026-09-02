import { S3StorageService } from "./s3-storage.service";
import { S3Adapter } from "../../adapters/outputs/s3/s3.adapter";
import DownloadFile, { DownloadFileReturn } from "../../usecases/download-file";

jest.mock("../../adapters/outputs/s3/s3.adapter");
import * as FileHelper from "../../shared/helpers/FileHelper";
jest.mock("../../shared/helpers/FileHelper", () => ({
    bufferToMulterFile: jest.fn(),
}));

const BUFFER = Buffer.from([]);

jest.mock("fs", () => ({
    promises: {
        readFile: jest.fn().mockImplementation(() => BUFFER),
    },
}));

describe("S3Fileservice", () => {
    const mockS3Adapter = {
        getFileStream: jest.fn(),
        listFiles: jest.fn(),
        deleteFile: jest.fn(),
        uploadFile: jest.fn(),
        getDownloadUrl: jest.fn(),
        getFile: jest.fn(),
    } as unknown as jest.Mocked<S3Adapter>;
    const mockDownloadFile = { execute: jest.fn() } as unknown as jest.Mocked<DownloadFile>;

    const service = new S3StorageService(mockS3Adapter, mockDownloadFile);
    let mockFile: Express.Multer.File;

    let USER_ID: string;
    let EXISTING_FILES;
    let UPLOAD_KEY: string;

    beforeEach(() => {
        EXISTING_FILES = [
            { path: "user123/old1.csv", importDate: new Date("2026-05-12") },
            { path: "user123/old2.csv", importDate: new Date("2026-05-20") },
        ];
        UPLOAD_KEY = "user123/test.csv";
        USER_ID = "user123";

        mockFile = {
            originalname: "test.csv",
            buffer: Buffer.from("test content"),
            mimetype: "text/csv",
            size: 100,
        } as Express.Multer.File;
    });

    describe("uploadAndReplaceUserFile", () => {
        it("should call listFiles", async () => {
            mockS3Adapter.listFiles.mockResolvedValue(EXISTING_FILES);
            mockS3Adapter.deleteFile.mockResolvedValue(undefined);
            mockS3Adapter.uploadFile.mockResolvedValue(UPLOAD_KEY);

            await service.uploadAndReplaceUserFile(mockFile, USER_ID);

            expect(mockS3Adapter.listFiles).toHaveBeenCalledWith(USER_ID);
        });

        it("should call delete files", async () => {
            mockS3Adapter.listFiles.mockResolvedValue(EXISTING_FILES);
            mockS3Adapter.deleteFile.mockResolvedValue(undefined);
            mockS3Adapter.uploadFile.mockResolvedValue(UPLOAD_KEY);

            await service.uploadAndReplaceUserFile(mockFile, USER_ID);

            expect(mockS3Adapter.deleteFile).toHaveBeenCalledWith("user123/old1.csv");
            expect(mockS3Adapter.deleteFile).toHaveBeenCalledWith("user123/old2.csv");
        });

        it("should call uploadUserFile files", async () => {
            mockS3Adapter.listFiles.mockResolvedValue(EXISTING_FILES);
            mockS3Adapter.deleteFile.mockResolvedValue(undefined);
            mockS3Adapter.uploadFile.mockResolvedValue(UPLOAD_KEY);

            await service.uploadAndReplaceUserFile(mockFile, USER_ID);

            expect(mockS3Adapter.uploadFile).toHaveBeenCalledWith(mockFile, "user123/test.csv");
        });

        it("should return uploaded file key", async () => {
            mockS3Adapter.listFiles.mockResolvedValue(EXISTING_FILES);
            mockS3Adapter.deleteFile.mockResolvedValue(undefined);
            mockS3Adapter.uploadFile.mockResolvedValue(UPLOAD_KEY);

            const result = await service.uploadAndReplaceUserFile(mockFile, USER_ID);

            expect(result).toBe(UPLOAD_KEY);
        });
    });

    describe("uploadUserFile", () => {
        it("upload file with correct key format", async () => {
            mockS3Adapter.uploadFile.mockResolvedValue(UPLOAD_KEY);

            const result = await service.uploadUserFile(mockFile, USER_ID);

            expect(mockS3Adapter.uploadFile).toHaveBeenCalledWith(mockFile, UPLOAD_KEY);
            expect(result).toBe(UPLOAD_KEY);
        });
    });

    describe("getUserFileDownloadUrl", () => {
        it("return download url for valid user and filename", async () => {
            const fileName = "document.csv";
            const expectedKey = "user123/document.csv";
            const expectedUrl = "https://presigned-url.com/1234569874";

            mockS3Adapter.getDownloadUrl.mockResolvedValue(expectedUrl);

            const result = await service.getUserFileDownloadUrl(USER_ID, fileName);

            expect(mockS3Adapter.getDownloadUrl).toHaveBeenCalledWith(expectedKey);
            expect(result).toBe(expectedUrl);
        });
    });

    describe("deleteUserFile", () => {
        it("delete file with correct key format", async () => {
            const fileName = "toDelete.csv";
            const expectedKey = "user123/toDelete.csv";

            mockS3Adapter.deleteFile.mockResolvedValue(undefined);

            await service.deleteUserFile(USER_ID, fileName);

            expect(mockS3Adapter.deleteFile).toHaveBeenCalledWith(expectedKey);
        });
    });

    describe("getUserFile", () => {
        const bufferToMulterFileMock = jest.spyOn(FileHelper, "bufferToMulterFile");

        const FILE_NAME = "test.csv";
        const FILE_INFO: DownloadFileReturn = {
            filePath: `/path/to/${FILE_NAME}`,
            status: 200,
            statusText: "OK",
            contentType: FILE_NAME,
        };

        beforeAll(() => {
            mockDownloadFile.execute.mockResolvedValue(FILE_INFO);
        });

        afterEach(() => {
            bufferToMulterFileMock.mockRestore();
        });

        it("downloads file", async () => {
            await service.getUserFile(USER_ID, FILE_NAME);

            expect(mockDownloadFile.execute).toHaveBeenCalledWith(`${USER_ID}/${FILE_NAME}`);
        });

        it("calls bufferToMulterFile with valid params", async () => {
            await service.getUserFile(USER_ID, FILE_NAME);

            expect(bufferToMulterFileMock).toHaveBeenCalledWith(BUFFER, FILE_NAME, FILE_INFO.contentType);
        });
    });
});
