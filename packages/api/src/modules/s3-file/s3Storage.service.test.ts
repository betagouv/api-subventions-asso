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

    let USER_ID: string;
    let EXISTING_FILES: string[];
    let UPLOAD_KEY: string;

    beforeEach(() => {
        EXISTING_FILES = ["user123/old1.csv", "user123/old2.csv"];
        UPLOAD_KEY = "user123/test.csv";
        USER_ID = "user123";

        service = new S3StorageService();
        mockFile = {
            originalname: "test.csv",
            buffer: Buffer.from("test content"),
            mimetype: "text/csv",
            size: 100,
        } as Express.Multer.File;
    });

    describe("uploadAndReplaceUserFile", () => {
        it("should call listFiles", async () => {
            mockS3ClientPort.listFiles.mockResolvedValue(EXISTING_FILES);
            mockS3ClientPort.deleteFile.mockResolvedValue(undefined);
            mockS3ClientPort.uploadFile.mockResolvedValue(UPLOAD_KEY);

            await service.uploadAndReplaceUserFile(mockFile, USER_ID);

            expect(mockS3ClientPort.listFiles).toHaveBeenCalledWith(USER_ID);
        });

        it("should call delete files", async () => {
            mockS3ClientPort.listFiles.mockResolvedValue(EXISTING_FILES);
            mockS3ClientPort.deleteFile.mockResolvedValue(undefined);
            mockS3ClientPort.uploadFile.mockResolvedValue(UPLOAD_KEY);

            await service.uploadAndReplaceUserFile(mockFile, USER_ID);

            expect(mockS3ClientPort.deleteFile).toHaveBeenCalledWith("user123/old1.csv");
            expect(mockS3ClientPort.deleteFile).toHaveBeenCalledWith("user123/old2.csv");
        });

        it("should call uploadUserFile files", async () => {
            mockS3ClientPort.listFiles.mockResolvedValue(EXISTING_FILES);
            mockS3ClientPort.deleteFile.mockResolvedValue(undefined);
            mockS3ClientPort.uploadFile.mockResolvedValue(UPLOAD_KEY);

            await service.uploadAndReplaceUserFile(mockFile, USER_ID);

            expect(mockS3ClientPort.uploadFile).toHaveBeenCalledWith(mockFile, "user123/test.csv");
        });

        it("should return uploaded file key", async () => {
            mockS3ClientPort.listFiles.mockResolvedValue(EXISTING_FILES);
            mockS3ClientPort.deleteFile.mockResolvedValue(undefined);
            mockS3ClientPort.uploadFile.mockResolvedValue(UPLOAD_KEY);

            const result = await service.uploadAndReplaceUserFile(mockFile, USER_ID);

            expect(result).toBe(UPLOAD_KEY);
        });
    });

    describe("uploadUserFile", () => {
        it("upload file with correct key format", async () => {
            mockS3ClientPort.uploadFile.mockResolvedValue(UPLOAD_KEY);

            const result = await service.uploadUserFile(mockFile, USER_ID);

            expect(mockS3ClientPort.uploadFile).toHaveBeenCalledWith(mockFile, UPLOAD_KEY);
            expect(result).toBe(UPLOAD_KEY);
        });
    });

    describe("getUserFileDownloadUrl", () => {
        it("return download url for valid user and filename", async () => {
            const fileName = "document.csv";
            const expectedKey = "user123/document.csv";
            const expectedUrl = "https://presigned-url.com/1234569874";

            mockS3ClientPort.getDownloadUrl.mockResolvedValue(expectedUrl);

            const result = await service.getUserFileDownloadUrl(USER_ID, fileName);

            expect(mockS3ClientPort.getDownloadUrl).toHaveBeenCalledWith(expectedKey);
            expect(result).toBe(expectedUrl);
        });
    });

    describe("deleteUserFile", () => {
        it("delete file with correct key format", async () => {
            const fileName = "toDelete.csv";
            const expectedKey = "user123/toDelete.csv";

            mockS3ClientPort.deleteFile.mockResolvedValue(undefined);

            await service.deleteUserFile(USER_ID, fileName);

            expect(mockS3ClientPort.deleteFile).toHaveBeenCalledWith(expectedKey);
        });
    });

    describe("getUserFile", () => {
        const bufferToMulterFileMock = jest.spyOn({ bufferToMulterFile }, "bufferToMulterFile");

        afterEach(() => {
            bufferToMulterFileMock.mockRestore();
        });

        it("calls getFile with correct key", async () => {
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

            await service.getUserFile(USER_ID, fileName);

            expect(mockS3ClientPort.getFile).toHaveBeenCalledWith(`${USER_ID}/${fileName}`);
        });

        it("calls bufferToMulterFile with valid params", async () => {
            const fileName = "test.csv";

            const file = createMockFile(fileName);
            const buffer = Buffer.from(file.buffer);
            const fileData: S3FileData = {
                buffer: buffer,
                contentType: file.mimetype,
                key: "path/to/file/" + fileName,
            };

            mockS3ClientPort.getFile.mockResolvedValue(fileData);

            await service.getUserFile(USER_ID, fileName);

            expect(bufferToMulterFileMock).toHaveBeenCalledWith(fileData.buffer, fileName, fileData.contentType);
        });

        it("throw error when no file found", async () => {
            const fileName = "test.csv";

            mockS3ClientPort.getFile.mockResolvedValue(null);

            await expect(service.getUserFile(USER_ID, fileName)).rejects.toThrow(NotFoundError);
        });
    });
});
