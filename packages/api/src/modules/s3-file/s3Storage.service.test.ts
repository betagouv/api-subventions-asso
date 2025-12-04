import { S3StorageService } from "./s3Storage.service";
import { S3FileData } from "../../@types/S3FileData";

jest.mock("../../dataProviders/s3/s3.port", () => ({
    listFiles: jest.fn(),
    deleteFile: jest.fn(),
    uploadFile: jest.fn(),
    getDownloadUrl: jest.fn(),
    getFile: jest.fn(),
}));
import s3ClientPort from "../../dataProviders/s3/s3.port";

jest.mock("../../shared/helpers/FileHelper", () => ({
    bufferToMulterFile: jest.fn(),
}));
import { bufferToMulterFile } from "../../shared/helpers/FileHelper";
import { NotFoundError } from "core";

const mockS3ClientPort = s3ClientPort as jest.Mocked<typeof s3ClientPort>;

const createMockFile = (originalname: string, buffer: Buffer = Buffer.from("test")): Express.Multer.File => ({
    fieldname: "file",
    originalname,
    encoding: "7bit",
    mimetype: "text/csv",
    buffer,
    size: buffer.length,
    destination: "",
    filename: "",
    path: "",
    stream: {} as never,
});

describe("S3FileService", () => {
    let service: S3StorageService;
    let mockFile: Express.Multer.File;

    beforeEach(() => {
        service = new S3StorageService();
        mockFile = {
            originalname: "test.csv",
            buffer: Buffer.from("test content"),
            mimetype: "text/csv",
            size: 100,
        } as Express.Multer.File;

        jest.clearAllMocks();
    });

    describe("uploadAndReplaceUserFile", () => {
        it("should call listFiles", async () => {
            const userId = "user123";
            const existingFiles = ["user123/old1.csv", "user123/old2.csv"];
            const expectedUploadKey = "user123/test.csv";

            mockS3ClientPort.listFiles.mockResolvedValue(existingFiles);
            mockS3ClientPort.deleteFile.mockResolvedValue(undefined);
            mockS3ClientPort.uploadFile.mockResolvedValue(expectedUploadKey);

            await service.uploadAndReplaceUserFile(mockFile, userId);

            expect(mockS3ClientPort.listFiles).toHaveBeenCalledWith(userId);
        });

        it("should call delete files", async () => {
            const userId = "user123";
            const existingFiles = ["user123/old1.csv", "user123/old2.csv"];
            const expectedUploadKey = "user123/test.csv";

            mockS3ClientPort.listFiles.mockResolvedValue(existingFiles);
            mockS3ClientPort.deleteFile.mockResolvedValue(undefined);
            mockS3ClientPort.uploadFile.mockResolvedValue(expectedUploadKey);

            await service.uploadAndReplaceUserFile(mockFile, userId);

            expect(mockS3ClientPort.deleteFile).toHaveBeenCalledTimes(2);
            expect(mockS3ClientPort.deleteFile).toHaveBeenCalledWith("user123/old1.csv");
            expect(mockS3ClientPort.deleteFile).toHaveBeenCalledWith("user123/old2.csv");
        });

        it("should call uploadUserFile files", async () => {
            const userId = "user123";
            const existingFiles = ["user123/old1.csv", "user123/old2.csv"];
            const expectedUploadKey = "user123/test.csv";

            mockS3ClientPort.listFiles.mockResolvedValue(existingFiles);
            mockS3ClientPort.deleteFile.mockResolvedValue(undefined);
            mockS3ClientPort.uploadFile.mockResolvedValue(expectedUploadKey);

            await service.uploadAndReplaceUserFile(mockFile, userId);

            expect(mockS3ClientPort.uploadFile).toHaveBeenCalledWith(mockFile, "user123/test.csv");
        });

        it("should return uploaded file key", async () => {
            const userId = "user123";
            const existingFiles = ["user123/old1.csv", "user123/old2.csv"];
            const expectedUploadKey = "user123/test.csv";

            mockS3ClientPort.listFiles.mockResolvedValue(existingFiles);
            mockS3ClientPort.deleteFile.mockResolvedValue(undefined);
            mockS3ClientPort.uploadFile.mockResolvedValue(expectedUploadKey);

            const result = await service.uploadAndReplaceUserFile(mockFile, userId);

            expect(result).toBe(expectedUploadKey);
        });
    });

    describe("uploadUserFile", () => {
        it("upload file with correct key format", async () => {
            const userId = "user789";
            const expectedKey = "user789/test.csv";
            const expectedUploadKey = "user789/test.csv";

            mockS3ClientPort.uploadFile.mockResolvedValue(expectedUploadKey);

            const result = await service.uploadUserFile(mockFile, userId);

            expect(mockS3ClientPort.uploadFile).toHaveBeenCalledWith(mockFile, expectedKey);
            expect(result).toBe(expectedUploadKey);
        });
    });

    describe("getUserFileDownloadUrl", () => {
        it("return download url for valid user and filename", async () => {
            const userId = "user456";
            const fileName = "document.csv";
            const expectedKey = "user456/document.csv";
            const expectedUrl = "https://presigned-url.com/1234569874";

            mockS3ClientPort.getDownloadUrl.mockResolvedValue(expectedUrl);

            const result = await service.getUserFileDownloadUrl(userId, fileName);

            expect(mockS3ClientPort.getDownloadUrl).toHaveBeenCalledWith(expectedKey);
            expect(result).toBe(expectedUrl);
        });
    });

    describe("deleteUserFile", () => {
        it("delete file with correct key format", async () => {
            const userId = "user123";
            const fileName = "toDelete.csv";
            const expectedKey = "user123/toDelete.csv";

            mockS3ClientPort.deleteFile.mockResolvedValue(undefined);

            await service.deleteUserFile(userId, fileName);

            expect(mockS3ClientPort.deleteFile).toHaveBeenCalledWith(expectedKey);
        });
    });

    describe("getUserFile", () => {
        const bufferToMulterFileMock = jest.spyOn({ bufferToMulterFile }, "bufferToMulterFile");

        afterEach(() => {
            bufferToMulterFileMock.mockRestore();
        });

        it("calls getFile with correct key", async () => {
            const userId = "user456";
            const fileName = "test.csv";

            const file = createMockFile(fileName);
            const buffer = Buffer.from(file.buffer);
            const fileData = {
                buffer: buffer,
                contentType: file.mimetype,
                contentLength: file.size,
                key: "path/to/file/" + fileName,
            };

            mockS3ClientPort.getFile.mockResolvedValue(fileData);

            await service.getUserFile(userId, fileName);

            expect(mockS3ClientPort.getFile).toHaveBeenCalledWith(`${userId}/${fileName}`);
        });

        it("calls bufferToMulterFile with valid params", async () => {
            const userId = "user456";
            const fileName = "test.csv";

            const file = createMockFile(fileName);
            const buffer = Buffer.from(file.buffer);
            const fileData: S3FileData = {
                buffer: buffer,
                contentType: file.mimetype,
                key: "path/to/file/" + fileName,
            };

            mockS3ClientPort.getFile.mockResolvedValue(fileData);

            await service.getUserFile(userId, fileName);

            expect(bufferToMulterFileMock).toHaveBeenCalledWith(fileData.buffer, fileName, fileData.contentType);
        });

        it("throw error when no file found", async () => {
            const userId = "user456";
            const fileName = "test.csv";

            mockS3ClientPort.getFile.mockResolvedValue(null);

            await expect(service.getUserFile(userId, fileName)).rejects.toThrow(NotFoundError);
        });
    });
});
