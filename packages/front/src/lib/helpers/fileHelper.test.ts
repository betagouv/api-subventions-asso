import { beforeEach, describe, expect, it, vi } from "vitest";
import jschardet from "jschardet";
import XLSX from "xlsx";
import * as fileHelper from "./fileHelper";
import { FileErrorCode } from "./fileHelper";

vi.mock("jschardet");
vi.mock("xlsx");

const mockedJschardet = vi.mocked(jschardet);
const mockedXLSX = vi.mocked(XLSX);

describe("fileHelper", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const createMockFile = (name: string, size: number, type: string, content?: string): File => {
        return {
            name,
            size,
            type,
            text: vi.fn().mockResolvedValue(content || "test content"),
            arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
        } as unknown as File;
    };

    describe("getFileExtension", () => {
        it("should return the extension of a file in lowercase", () => {
            expect(fileHelper.getFileExtension("document.CSV")).toBe("csv");
            expect(fileHelper.getFileExtension("photo.JpG")).toBe("jpg");
            expect(fileHelper.getFileExtension("archive.tar.Gz")).toBe("gz");
        });

        it("should return undefined if there is no extension", () => {
            expect(fileHelper.getFileExtension("fileWithoutExtension")).toBeUndefined();
            expect(fileHelper.getFileExtension("anotherfile.")).toBeUndefined();
        });

        it("should handle empty strings", () => {
            expect(fileHelper.getFileExtension("")).toBeUndefined();
        });
    });

    describe("validateFile", () => {
        it("should return valid result for a valid file", async () => {
            const file = createMockFile("test.csv", 1024 * 1024, "text/csv");
            mockedJschardet.detect.mockReturnValue({ encoding: "UTF-8", confidence: 0.99 });

            const result = await fileHelper.validateFile(file, ["csv"], 10);

            expect(result.valid).toBe(true);
            expect(result.fileName).toBe("test.csv");
            expect(result.errorCode).toBeUndefined();
        });

        it("should return invalid result for file too large", async () => {
            const file = createMockFile("test.csv", 50 * 1024 * 1024, "text/csv");

            const result = await fileHelper.validateFile(file, ["csv"], 10);

            expect(result.valid).toBe(false);
            expect(result.errorCode).toBe(FileErrorCode.FILE_TOO_LARGE);
            expect(result.fileName).toBe("test.csv");
        });

        it("should return invalid result for invalid format", async () => {
            const file = createMockFile("test.pdf", 1024, "application/pdf");

            const result = await fileHelper.validateFile(file, ["csv"], 10);

            expect(result.valid).toBe(false);
            expect(result.errorCode).toBe(FileErrorCode.INVALID_FORMAT);
            expect(result.fileName).toBe("test.pdf");
        });

        it("should return invalid result for invalid encoding", async () => {
            const file = createMockFile("test.txt", 1024, "text/plain");
            mockedJschardet.detect.mockReturnValue({ encoding: "ISO-8859", confidence: 0.99 });

            const result = await fileHelper.validateFile(file, ["txt"], 10);

            expect(result.valid).toBe(false);
            expect(result.errorCode).toBe(FileErrorCode.INVALID_ENCODING);
            expect(result.fileName).toBe("test.txt");
        });

        it("should use default max size of 30MB", async () => {
            const file = createMockFile("test.csv", 40 * 1024 * 1024, "text/csv");

            const result = await fileHelper.validateFile(file, ["csv"]);

            expect(result.valid).toBe(false);
            expect(result.errorCode).toBe(FileErrorCode.FILE_TOO_LARGE);
        });
    });

    describe("validateFileSize", () => {
        it("should validate file size correctly", () => {
            const file = createMockFile("test.csv", 5 * 1024 * 1024, "text/csv");

            const result = fileHelper.validateFileSize(file, 10);

            expect(result.valid).toBe(true);
        });

        it("should reject file exceeding size limit", () => {
            const file = createMockFile("test.csv", 15 * 1024 * 1024, "text/csv");

            const result = fileHelper.validateFileSize(file, 10);

            expect(result.valid).toBe(false);
            expect(result.errorCode).toBe(FileErrorCode.FILE_TOO_LARGE);
        });
    });

    describe("validateFileFormat", () => {
        it("should validate CSV format correctly", () => {
            const file = createMockFile("test.csv", 1024, "text/csv");

            const result = fileHelper.validateFileFormat(file, ["csv"]);

            expect(result.valid).toBe(true);
        });

        it("should validate Excel format correctly", () => {
            const file = createMockFile(
                "test.xlsx",
                1024,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            );

            const result = fileHelper.validateFileFormat(file, ["xls"]);

            expect(result.valid).toBe(true);
        });

        it("should reject invalid format", () => {
            const file = createMockFile("test.pdf", 1024, "application/pdf");

            const result = fileHelper.validateFileFormat(file, ["csv"]);

            expect(result.valid).toBe(false);
            expect(result.errorCode).toBe(FileErrorCode.INVALID_FORMAT);
        });

        it("should validate multiple accepted formats", () => {
            const file = createMockFile("test.json", 1024, "application/json");

            const result = fileHelper.validateFileFormat(file, ["csv", "json", "xml"]);

            expect(result.valid).toBe(true);
        });
    });

    describe("validateFileEncoding", () => {
        it("should validate text file with valid encoding", async () => {
            const file = createMockFile("test.txt", 1024, "text/plain", "Hello world");
            mockedJschardet.detect.mockReturnValue({ encoding: "UTF-8", confidence: 0.99 });

            const result = await fileHelper.validateFileEncoding(file);

            expect(result.valid).toBe(true);
        });

        it("should reject text file with invalid encoding", async () => {
            const file = createMockFile("test.txt", 1024, "text/plain", "Hello world");
            mockedJschardet.detect.mockReturnValue({ encoding: "ISO-8859-1", confidence: 0.99 });

            const result = await fileHelper.validateFileEncoding(file);

            expect(result.valid).toBe(false);
            expect(result.errorCode).toBe(FileErrorCode.INVALID_ENCODING);
        });

        it("should validate non text files without encoding check", async () => {
            const file = createMockFile("test.xls", 1024, "application/vnd.ms-excel");

            const result = await fileHelper.validateFileEncoding(file);

            expect(result.valid).toBe(true);
            expect(mockedJschardet.detect).not.toHaveBeenCalled();
        });
    });

    describe("verifyTextEncoding", () => {
        it("should return true for valid UTF-8 encoding", async () => {
            const file = createMockFile("test.txt", 1024, "text/plain", "Hello world");
            mockedJschardet.detect.mockReturnValue({ encoding: "UTF-8", confidence: 0.99 });

            const result = await fileHelper.verifyTextEncoding(file);

            expect(result).toBe(true);
            expect(mockedJschardet.detect).toHaveBeenCalledWith("Hello world");
        });

        it("should return true for valid Windows-1252 encoding", async () => {
            const file = createMockFile("test.csv", 1024, "text/csv", "col1,col2\nval1,val2");
            mockedJschardet.detect.mockReturnValue({ encoding: "Windows-1252", confidence: 0.99 });

            const result = await fileHelper.verifyTextEncoding(file);

            expect(result).toBe(true);
        });

        it("should return false for invalid encoding", async () => {
            const file = createMockFile("test.csv", 1024, "text/csv", "col1,col2\nval1,val2");
            mockedJschardet.detect.mockReturnValue({ encoding: "ISO-8859", confidence: 0.99 });

            const result = await fileHelper.verifyTextEncoding(file);

            expect(result).toBe(false);
        });

        it("should return true for non text files", async () => {
            const file = createMockFile("test.pdf", 1024, "application/pdf");

            const result = await fileHelper.verifyTextEncoding(file);

            expect(result).toBe(true);
            expect(mockedJschardet.detect).not.toHaveBeenCalled();
        });
    });

    describe("getExcelSheetNames", () => {
        it("should return sheet names from Excel file", async () => {
            const file = createMockFile(
                "test.xlsx",
                1024,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            );
            const mockArrayBuffer = new ArrayBuffer(8);
            vi.spyOn(file, "arrayBuffer").mockResolvedValue(mockArrayBuffer);

            const mockContent = {
                SheetNames: ["Sheet1", "Sheet2", "Data"],
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            mockedXLSX.read.mockReturnValue(mockContent as any);

            const result = await fileHelper.getExcelSheetNames(file);

            expect(result).toEqual(["Sheet1", "Sheet2", "Data"]);
            expect(mockedXLSX.read).toHaveBeenCalledWith(mockArrayBuffer, {
                type: "array",
                bookSheets: true,
            });
        });

        it("should throw error when Excel file reading fails", async () => {
            const file = createMockFile(
                "test.xlsx",
                1024,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            );
            vi.spyOn(file, "arrayBuffer").mockRejectedValue(new Error("Read failed"));

            await expect(fileHelper.getExcelSheetNames(file)).rejects.toThrow("Error reading Excel file test.xlsx");
        });

        it("should handle Excel file with no sheets", async () => {
            const file = createMockFile(
                "test.xlsx",
                1024,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            );
            const mockArrayBuffer = new ArrayBuffer(8);
            vi.spyOn(file, "arrayBuffer").mockResolvedValue(mockArrayBuffer);

            const mockContent = {
                SheetNames: [],
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            mockedXLSX.read.mockReturnValue(mockContent as any);

            const result = await fileHelper.getExcelSheetNames(file);

            expect(result).toEqual([]);
        });
    });
});
