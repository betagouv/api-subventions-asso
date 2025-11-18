import { beforeEach, describe, expect, it, vi } from "vitest";
import XLSX from "xlsx";
import * as fileHelper from "./fileHelper";
import FileFormatError from "$lib/errors/file-errors/FileFormatError";
import FileSizeError from "$lib/errors/file-errors/FileSizeError";
import FileEncodingError from "$lib/errors/file-errors/FileEncodingError";

vi.mock("jschardet");
vi.mock("xlsx");

const mockedXLSX = vi.mocked(XLSX);

describe("fileHelper", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const createMockFile = (
        name: string,
        options?: { type?: string; size?: number },
        content?: string | Uint8Array,
    ): File => {
        const type = options?.type || "text/csv";
        let bytes: Uint8Array;

        if (content instanceof Uint8Array) {
            bytes = content;
        } else {
            const encoder = new TextEncoder();
            bytes = encoder.encode(content ? content : "test content");
        }

        if (options?.size && options.size > bytes.length) {
            const extra = new Uint8Array(options.size - bytes.length);
            const combined = new Uint8Array(bytes.length + extra.length);
            combined.set(bytes);
            combined.set(extra, bytes.length);
            bytes = combined;
        }

        return {
            name,
            size: bytes.length,
            type,
            text: vi.fn().mockResolvedValue(content instanceof Uint8Array ? "" : content),
            arrayBuffer: vi.fn().mockResolvedValue(bytes.buffer),
        } as unknown as File;
    };

    describe("getFileExtension", () => {
        it("should return the extension of a file in lowercase", () => {
            expect(fileHelper.getFileExtension("document.CSV")).toBe("csv");
            expect(fileHelper.getFileExtension("photo.JpG")).toBe("jpg");
            expect(fileHelper.getFileExtension("archive.tar.Gz")).toBe("gz");
        });

        it("should throw FileFormatError if there is no extension", () => {
            expect(() => fileHelper.getFileExtension("fileWithoutExtension")).toThrow(FileFormatError);
            expect(() => fileHelper.getFileExtension("anotherfile.")).toThrow(FileFormatError);
        });
    });

    describe("validateFile", () => {
        it("should not throw for a valid file", async () => {
            const file = createMockFile("test.csv");

            expect(async () => {
                await fileHelper.validateFile(file, ["csv"], 10);
            }).not.toThrow();
        });

        it("should throw FileSizeError for file too large", async () => {
            const file = createMockFile("test.csv", { type: "text/csv", size: 1024 * 1024 * 50 });
            await expect(fileHelper.validateFile(file, ["csv"], 10)).rejects.toThrow(FileSizeError);
        });

        it("should throw FileFormatError for invalid format", async () => {
            const file = createMockFile("test.pdf", { type: "application/pdf" });
            await expect(fileHelper.validateFile(file, ["csv"], 10)).rejects.toThrow(FileFormatError);
        });

        it("should return invalid result for invalid encoding", async () => {
            const invalidBytes = new Uint8Array([0x80, 0x81, 0x82]);
            const file = createMockFile("invalid.csv", {}, invalidBytes);

            await expect(fileHelper.validateFile(file, ["csv"], 10)).rejects.toThrow(FileEncodingError);
        });

        it("should use default max size of 30MB", async () => {
            const file = createMockFile("test.csv", { size: 40 * 1024 * 1024 });

            await expect(fileHelper.validateFile(file, ["csv"])).rejects.toThrow(FileSizeError);
        });
    });

    describe("validateFileSize", () => {
        it("should validate file size correctly", () => {
            const file = createMockFile("test.csv", { size: 5 * 1024 * 1024 });

            expect(() => {
                fileHelper.validateFileSize(file, 10);
            }).not.toThrow();
        });

        it("should reject file exceeding size limit", () => {
            const file = createMockFile("test.csv", { size: 15 * 1024 * 1024 });

            expect(() => {
                fileHelper.validateFileSize(file, 10);
            }).toThrow(FileSizeError);
        });
    });

    describe("validateFileFormat", () => {
        it("should validate CSV format correctly", () => {
            const file = createMockFile("test.csv");
            const fileExtension = fileHelper.getFileExtension(file.name);

            expect(() => {
                fileHelper.validateFileFormat(file, fileExtension, ["csv"]);
            }).not.toThrow();
        });

        it("should validate Excel format correctly", () => {
            const file = createMockFile("test.xlsx", {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const fileExtension = fileHelper.getFileExtension(file.name);

            expect(() => {
                fileHelper.validateFileFormat(file, fileExtension, ["xls"]);
            }).not.toThrow();
        });

        it("should throw invalid format", () => {
            const file = createMockFile("test.pdf", { type: "application/pdf" });
            const fileExtension = fileHelper.getFileExtension(file.name);
            expect(() => {
                fileHelper.validateFileFormat(file, fileExtension, ["csv"]);
            }).toThrow(FileFormatError);
        });

        it("should validate multiple accepted formats", () => {
            const file = createMockFile("test.csv");
            const fileExtension = fileHelper.getFileExtension(file.name);

            expect(() => {
                fileHelper.validateFileFormat(file, fileExtension, ["csv", "xls"]);
            }).not.toThrow();
        });
    });

    describe("validateFileEncoding", () => {
        it("should validate text file with valid encoding", async () => {
            const file = createMockFile("test.txt", { type: "text/plain" }, "Hello world");

            expect(async () => {
                await fileHelper.validateFileEncoding(file);
            }).not.toThrow();
        });

        it("should throw with invalid encoding", async () => {
            const invalidBytes = new Uint8Array([0x80, 0x81, 0x82]);
            const file = createMockFile("test.txt", { type: "text/plain" }, invalidBytes);

            await expect(fileHelper.validateFileEncoding(file)).rejects.toThrow(FileEncodingError);
        });
    });

    describe("getExcelSheetNames", () => {
        it("should return sheet names from Excel file", async () => {
            const file = createMockFile("test.xlsx", {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
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
            const file = createMockFile("test.xlsx", {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            vi.spyOn(file, "arrayBuffer").mockRejectedValue(new Error("Read failed"));

            await expect(fileHelper.getExcelSheetNames(file)).rejects.toThrow("Error reading Excel file test.xlsx");
        });

        it("should handle Excel file with no sheets", async () => {
            const file = createMockFile("test.xlsx", {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
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
