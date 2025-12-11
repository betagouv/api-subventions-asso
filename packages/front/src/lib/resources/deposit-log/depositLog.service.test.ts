import depositLogService, { FILE_VALIDATION_STATES } from "$lib/resources/deposit-log/depositLog.service";
import depositLogPort from "$lib/resources/deposit-log/depositLog.port";
import type {
    CreateDepositScdlLogDto,
    DepositScdlLogDto,
    DepositScdlLogResponseDto,
    FileDownloadUrlDto,
    UploadedFileInfosDto,
} from "dto";
import type { AxiosResponse } from "axios";
import type { MockedFunction, MockInstance } from "vitest";
import { type Input, type Options, stringify } from "csv-stringify/browser/esm/sync";

vi.mock("csv-stringify/browser/esm/sync", () => ({
    stringify: vi.fn(),
}));

describe("DepositLogService", () => {
    vi.spyOn(depositLogPort, "getDepositLog");
    vi.spyOn(depositLogPort, "createDepositLog");
    vi.spyOn(depositLogPort, "updateDepositLog");
    vi.spyOn(depositLogPort, "deleteDepositLog");
    vi.spyOn(depositLogPort, "validateScdlFile");
    vi.spyOn(depositLogPort, "persistScdlFile");
    vi.spyOn(depositLogPort, "getExistingScdlDatas");
    vi.spyOn(depositLogPort, "getFileDownloadUrl");

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("getDepositLog", () => {
        it("should return null when status is 204", async () => {
            const response = {
                data: "",
                status: 204,
            } as AxiosResponse;
            vi.mocked(depositLogPort.getDepositLog).mockResolvedValue(response);

            const result = await depositLogService.getDepositLog();

            expect(depositLogPort.getDepositLog).toHaveBeenCalledTimes(1);
            expect(result).toBeNull();
        });

        it("should return data when exists", async () => {
            const response = {
                data: {
                    overwriteAlert: true,
                    allocatorSiret: "12345678901234",
                    step: 1,
                },
                status: 200,
            } as AxiosResponse;

            vi.mocked(depositLogPort.getDepositLog).mockResolvedValue(response);

            const result = await depositLogService.getDepositLog();

            expect(depositLogPort.getDepositLog).toHaveBeenCalledTimes(1);
            expect(result).toEqual(response.data as DepositScdlLogResponseDto);
        });

        it("should throw error", async () => {
            const mockError = new Error("error");
            vi.mocked(depositLogPort.getDepositLog).mockRejectedValue(mockError);

            await expect(depositLogService.getDepositLog()).rejects.toThrow(mockError);
            expect(depositLogPort.getDepositLog).toHaveBeenCalledTimes(1);
        });
    });

    describe("createDepositLog", () => {
        it("should return data", async () => {
            const response = {
                data: {
                    overwriteAlert: true,
                    allocatorSiret: "12345678901234",
                    step: 1,
                },
                status: 204,
            } as AxiosResponse;

            vi.mocked(depositLogPort.createDepositLog).mockResolvedValue(response);

            const result = await depositLogService.createDepositLog({} as CreateDepositScdlLogDto);

            expect(depositLogPort.createDepositLog).toHaveBeenCalledTimes(1);
            expect(result).toEqual(response.data as DepositScdlLogResponseDto);
        });

        it("should throw error", async () => {
            const mockError = new Error("error");
            vi.mocked(depositLogPort.createDepositLog).mockRejectedValue(mockError);

            await expect(depositLogService.createDepositLog({})).rejects.toThrow(mockError);
            expect(depositLogPort.createDepositLog).toHaveBeenCalledTimes(1);
        });
    });

    describe("updateDepositLog", () => {
        it("should return data", async () => {
            const response = {
                data: {
                    overwriteAlert: true,
                    allocatorSiret: "12345678901234",
                    step: 1,
                },
                status: 200,
            } as AxiosResponse;

            vi.mocked(depositLogPort.updateDepositLog).mockResolvedValue(response);

            const result = await depositLogService.updateDepositLog(1, {} as DepositScdlLogDto);

            expect(depositLogPort.updateDepositLog).toHaveBeenCalledTimes(1);
            expect(result).toEqual(response.data as DepositScdlLogResponseDto);
        });

        it("should throw error", async () => {
            const mockError = new Error("error");
            vi.mocked(depositLogPort.updateDepositLog).mockRejectedValue(mockError);

            await expect(depositLogService.updateDepositLog(1, {})).rejects.toThrow(mockError);
            expect(depositLogPort.updateDepositLog).toHaveBeenCalledTimes(1);
        });
    });

    describe("deleteDepositLog", () => {
        it("should return no data", async () => {
            const response = {
                data: "",
                status: 204,
            } as AxiosResponse;

            vi.mocked(depositLogPort.deleteDepositLog).mockResolvedValue(response);

            const result = await depositLogService.deleteDepositLog();

            expect(depositLogPort.deleteDepositLog).toHaveBeenCalledTimes(1);
            expect(result).toEqual(null);
        });

        it("should throw error", async () => {
            const mockError = new Error("error");
            vi.mocked(depositLogPort.deleteDepositLog).mockRejectedValue(mockError);

            await expect(depositLogService.deleteDepositLog()).rejects.toThrow(mockError);
            expect(depositLogPort.deleteDepositLog).toHaveBeenCalledTimes(1);
        });
    });

    describe("postScdlFile", () => {
        it("should return data", async () => {
            const uploadedFileInfos = {};

            const response = {
                data: {
                    overwriteAlert: true,
                    allocatorSiret: "12345678901234",
                    step: 2,
                    permissionAlert: true,
                    uploadedFileInfos,
                } as DepositScdlLogResponseDto,
                status: 200,
            } as AxiosResponse;

            vi.mocked(depositLogPort.validateScdlFile).mockResolvedValue(response);

            const result = await depositLogService.postScdlFile({} as File, {} as DepositScdlLogDto);

            expect(depositLogPort.validateScdlFile).toHaveBeenCalledTimes(1);
            expect(result).toEqual(response.data as DepositScdlLogResponseDto);
        });

        it("should throw error", async () => {
            const mockError = new Error("error");
            vi.mocked(depositLogPort.validateScdlFile).mockRejectedValue(mockError);

            await expect(depositLogService.postScdlFile({} as File, {} as DepositScdlLogDto)).rejects.toThrow(
                mockError,
            );
            expect(depositLogPort.validateScdlFile).toHaveBeenCalledTimes(1);
        });
    });

    describe("getCsv", () => {
        it("should return data", async () => {
            const response = {
                data: "col1,col2,col3\ntoto,tata,1234\ntonton,tutu,4567",
                headers: {
                    "content-disposition": "attachment; filename=existing-grants-22160001800016-2025-20251120.csv",
                    "content-type": "text/csv; charset=utf-8",
                },
            } as Partial<AxiosResponse>;

            vi.mocked(depositLogPort.getExistingScdlDatas).mockResolvedValue(response as AxiosResponse);

            const result = await depositLogService.getCsv();

            expect(result).toEqual({
                csvData: response.data,
                fileName: "existing-grants-22160001800016-2025-20251120.csv",
            });
        });

        it("should throw error", async () => {
            const mockError = new Error("error");
            vi.mocked(depositLogPort.getExistingScdlDatas).mockRejectedValue(mockError);

            await expect(depositLogService.getCsv).rejects.toThrow(mockError);
        });
    });

    describe("persistScdlFile", () => {
        it("should return void", async () => {
            const response = {
                data: null,
                status: 204,
            } as AxiosResponse;

            vi.mocked(depositLogPort.persistScdlFile).mockResolvedValue(response);

            const result = await depositLogService.persistScdlFile();

            expect(depositLogPort.persistScdlFile).toHaveBeenCalledTimes(1);
            expect(result).toBeUndefined();
        });

        it("should throw error", async () => {
            const mockError = new Error("error");
            vi.mocked(depositLogPort.persistScdlFile).mockRejectedValue(mockError);

            await expect(depositLogService.persistScdlFile()).rejects.toThrow(mockError);
            expect(depositLogPort.persistScdlFile).toHaveBeenCalledTimes(1);
        });
    });

    describe("generateScdlFileUrl", () => {
        it("should return data", async () => {
            const response = {
                data: {
                    url: "presigned-url",
                },
                status: 200,
            } as AxiosResponse;

            vi.mocked(depositLogPort.getFileDownloadUrl).mockResolvedValue(response);

            const result = await depositLogService.generateScdlFileUrl();

            expect(depositLogPort.getFileDownloadUrl).toHaveBeenCalledTimes(1);
            expect(result).toEqual(response.data as FileDownloadUrlDto);
        });

        it("should throw error", async () => {
            const mockError = new Error("error");
            vi.mocked(depositLogPort.getFileDownloadUrl).mockRejectedValue(mockError);

            await expect(depositLogService.generateScdlFileUrl).rejects.toThrow(mockError);
            expect(depositLogPort.getFileDownloadUrl).toHaveBeenCalledTimes(1);
        });
    });

    describe("determineFileValidationState", () => {
        const fileInfos: UploadedFileInfosDto = {
            allocatorsSiret: ["98765432101234"],
            errors: [],
            existingLinesInDbOnSamePeriod: 122,
            parseableLines: 123,
            fileName: "test.csv",
            uploadDate: new Date(),
            grantCoverageYears: [2024],
            totalLines: 124,
        };

        it("should return multipleAllocator when multiple allocators", () => {
            const actual = depositLogService.determineFileValidationState("12345678901234", fileInfos);
            const expected = FILE_VALIDATION_STATES.MULTIPLE_ALLOCATORS;

            expect(actual).toEqual(expected);
        });

        it("should return lessGrantData when less grant data than in db", () => {
            fileInfos.existingLinesInDbOnSamePeriod = 124;

            const actual = depositLogService.determineFileValidationState("98765432101234", fileInfos);
            const expected = FILE_VALIDATION_STATES.LESS_GRANT_DATA;

            expect(actual).toEqual(expected);
        });

        it("should return blockingErrors when blocking errors", () => {
            fileInfos.errors = [{ bloquant: "oui" } as never];
            fileInfos.parseableLines = 125;

            const actual = depositLogService.determineFileValidationState("98765432101234", fileInfos);
            const expected = FILE_VALIDATION_STATES.BLOCKING_ERRORS;

            expect(actual).toEqual(expected);
        });

        it("should return confirmDataAdd when everything ok", () => {
            fileInfos.errors = [];

            const actual = depositLogService.determineFileValidationState("98765432101234", fileInfos);
            const expected = FILE_VALIDATION_STATES.CONFIRM_DATA_ADD;

            expect(actual).toEqual(expected);
        });
    });

    describe("downloadErrorFile", () => {
        let createObjectURLMock: MockInstance<(blob: Blob) => string>;
        let revokeObjectURLMock: MockInstance<(url: string) => void>;
        let mockLink: Partial<HTMLAnchorElement>;
        let stringifyMock: MockedFunction<(input: Input, options?: Options) => string>;

        const errors = [{ bloquant: "oui" } as never];

        const fileInfos: UploadedFileInfosDto = {
            allocatorsSiret: ["98765432101234"],
            errors: errors,
            existingLinesInDbOnSamePeriod: 125,
            parseableLines: 123,
            fileName: "test.csv",
            uploadDate: new Date(),
            grantCoverageYears: [2024],
            totalLines: 124,
        };

        const mockCsvString =
            "valeur,colonne,bloquant,doublon,message\nvaleur 1,colonne 1,oui,non,error message\nvaleur 2,colonne 2,oui,non,error message";

        beforeEach(() => {
            stringifyMock = vi.mocked(stringify);

            createObjectURLMock = vi.fn<(blob: Blob) => string>().mockReturnValue("blob:created-url-for-csv-file-data");
            revokeObjectURLMock = vi.fn<(url: string) => void>();

            vi.stubGlobal("URL", {
                createObjectURL: createObjectURLMock,
                revokeObjectURL: revokeObjectURLMock,
            });

            mockLink = {
                href: "",
                download: "",
                click: vi.fn(),
            };

            vi.spyOn(document, "createElement").mockReturnValue(mockLink as HTMLAnchorElement);
        });

        it("calls stringify with errors array", async () => {
            stringifyMock.mockReturnValue(mockCsvString);

            await depositLogService.downloadErrorFile(fileInfos);

            expect(stringifyMock).toHaveBeenCalledWith(errors, {
                header: true,
                quoted: true,
                quoted_empty: true,
            });
        });

        it("creates a CSV blob with correct MIME type", async () => {
            stringifyMock.mockReturnValue(mockCsvString);

            await depositLogService.downloadErrorFile(fileInfos);

            expect(createObjectURLMock).toHaveBeenCalledTimes(1);

            const blobCall = createObjectURLMock.mock.calls[0][0];
            expect(blobCall).toBeInstanceOf(Blob);
            expect(blobCall.type).toBe("text/csv; charset=utf-8");
        });

        it("triggers download of file", async () => {
            stringifyMock.mockReturnValue(mockCsvString);

            await depositLogService.downloadErrorFile(fileInfos);

            expect(createObjectURLMock).toHaveBeenCalledTimes(1);

            expect(mockLink.href).toBe("blob:created-url-for-csv-file-data");
            expect(mockLink.click).toHaveBeenCalledTimes(1);
        });

        it("revokes blob url after download", async () => {
            stringifyMock.mockReturnValue(mockCsvString);

            await depositLogService.downloadErrorFile(fileInfos);

            expect(revokeObjectURLMock).toHaveBeenCalledWith("blob:created-url-for-csv-file-data");
        });

        it("verify generated filename", async () => {
            stringifyMock.mockReturnValue(mockCsvString);

            await depositLogService.downloadErrorFile(fileInfos);

            expect(mockLink.download).toBe(`${fileInfos.fileName}.csv-errors.csv`);
        });
    });

    describe("downloadScdlFile", () => {
        const generateDownloadScdlFileUrlMock = vi.spyOn(depositLogService, "generateScdlFileUrl");
        let mockLink: Partial<HTMLAnchorElement>;

        beforeEach(() => {
            generateDownloadScdlFileUrlMock.mockResolvedValue({
                url: "presigned-url/",
            });

            vi.stubGlobal("document", {
                createElement: vi.fn().mockReturnValue(mockLink),
            });

            mockLink = {
                href: "",
                download: "",
                click: vi.fn(),
            };

            vi.spyOn(document, "createElement").mockReturnValue(mockLink as HTMLAnchorElement);
        });

        afterEach(() => {
            vi.unstubAllGlobals();
        });

        it("triggers download of file", async () => {
            await depositLogService.downloadScdlFile("filename.csv");

            expect(mockLink.href).toBe("presigned-url/");
            expect(mockLink.download).toBe("filename.csv");
            expect(mockLink.click).toHaveBeenCalledTimes(1);
        });
    });

    describe("downloadGrantCsv", () => {
        const getGrantCsvMock = vi.spyOn(depositLogService, "getCsv");
        let createObjectURLMock: MockInstance<(blob: Blob) => string>;
        let revokeObjectURLMock: MockInstance<(url: string) => void>;

        let mockLink: Partial<HTMLAnchorElement>;

        const mockCsvData = "col1,col2,col3\ntoto,tata,1234\ntonton,tutu,4567";
        const mockFileName = "test.csv";

        beforeEach(() => {
            getGrantCsvMock.mockResolvedValue({
                csvData: mockCsvData,
                fileName: mockFileName,
            });

            createObjectURLMock = vi.fn<(blob: Blob) => string>().mockReturnValue("blob:created-url-for-csv-file-data");
            revokeObjectURLMock = vi.fn<(url: string) => void>();

            vi.stubGlobal("URL", {
                createObjectURL: createObjectURLMock,
                revokeObjectURL: revokeObjectURLMock,
            });

            vi.stubGlobal("document", {
                createElement: vi.fn().mockReturnValue(mockLink),
                body: {
                    appendChild: vi.fn(),
                    removeChild: vi.fn(),
                },
            });

            mockLink = {
                href: "",
                download: "",
                click: vi.fn(),
            };

            vi.spyOn(document, "createElement").mockReturnValue(mockLink as HTMLAnchorElement);
        });

        it("creates a CSV blob with correct MIME type", async () => {
            await depositLogService.downloadGrantsCsv();

            expect(createObjectURLMock).toHaveBeenCalledTimes(1);

            const blobCall = createObjectURLMock.mock.calls[0][0];
            expect(blobCall).toBeInstanceOf(Blob);
            expect(blobCall.type).toBe("text/csv; charset=utf-8");
        });

        it("triggers download of file", async () => {
            await depositLogService.downloadGrantsCsv();

            expect(mockLink.href).toBe("blob:created-url-for-csv-file-data");
            expect(mockLink.download).toBe(mockFileName);
            expect(mockLink.click).toHaveBeenCalledTimes(1);
        });

        it("revokes blob url after download", async () => {
            await depositLogService.downloadGrantsCsv();

            expect(revokeObjectURLMock).toHaveBeenCalledWith("blob:created-url-for-csv-file-data");
        });
    });
});
