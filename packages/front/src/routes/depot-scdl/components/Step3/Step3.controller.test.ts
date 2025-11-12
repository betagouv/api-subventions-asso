import depositLogService from "$lib/resources/deposit-log/depositLog.service";
import Step3Controller from "./Step3.controller";
import { validateFile, getExcelSheetNames, getFileExtension } from "$lib/helpers/fileHelper";
import FileSizeError from "$lib/errors/file-errors/FileSizeError";
import FileFormatError from "$lib/errors/file-errors/FileFormatError";
import FileEncodingError from "$lib/errors/file-errors/FileEncodingError";
import type { DepositScdlLogDto, DepositScdlLogResponseDto } from "dto";

vi.mock("$lib/resources/deposit-log/depositLog.service");
vi.mock("$lib/helpers/fileHelper", async () => {
    const actual = await vi.importActual("$lib/helpers/fileHelper");
    return {
        ...actual,
        ...actual,
        validateFile: vi.fn(),
        getExcelSheetNames: vi.fn(),
        getFileExtension: vi.fn(),
        EXCEL_EXT: actual.EXCEL_EXT,
        CSV_EXT: actual.CSV_EXT,
        FileErrorCode: actual.FileErrorCode,
    };
});

describe("Step3Controller", () => {
    let controller: Step3Controller;
    let mockDispatch: ReturnType<typeof vi.fn>;
    let clearUploadErrorSpy: ReturnType<typeof vi.spyOn>;
    const postScdlFileMock = vi.spyOn(depositLogService, "postScdlFile");
    const validateFileMock = vi.mocked(validateFile);
    const getExcelSheetNamesMock = vi.mocked(getExcelSheetNames);
    const getFileExtensionMock = vi.mocked(getFileExtension);

    const createMockFile = (name: string, type: string): File => {
        return new File(["content"], name, { type });
    };

    beforeEach(() => {
        mockDispatch = vi.fn();
        controller = new Step3Controller(mockDispatch);
        clearUploadErrorSpy = vi.spyOn(controller, "clearUploadError");
        vi.clearAllMocks();
    });

    describe("handleFileChange", () => {
        it("should clear selected file and upload error when no files", async () => {
            const event = { detail: { files: null } } as CustomEvent<{ files: FileList | null }>;

            await controller.handleFileChange(event);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect((controller as any).selectedFile).toBe(null);
            expect(clearUploadErrorSpy).toHaveBeenCalled();
        });

        it("should set file and call clearUploadError", async () => {
            const mockFile = createMockFile("test.csv", "text/csv");
            const mockFileList = [mockFile] as unknown as FileList;
            const event = { detail: { files: mockFileList } } as CustomEvent<{ files: FileList | null }>;

            validateFileMock.mockResolvedValue();

            await controller.handleFileChange(event);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect((controller as any).selectedFile).toBe(mockFile);
            expect(clearUploadErrorSpy).toHaveBeenCalled();
        });

        it("should set error when file too large", async () => {
            const mockFile = createMockFile("test.csv", "text/csv");
            const mockFileList = [mockFile] as unknown as FileList;
            const event = { detail: { files: mockFileList } } as CustomEvent<{ files: FileList | null }>;

            validateFileMock.mockRejectedValue(new FileSizeError("test.csv", 30));

            await controller.handleFileChange(event);

            expect(controller.uploadError.value).toBe(true);
            expect(controller.noFileOrInvalid.value).toBe(true);
            expect(controller.uploadErrorMessage.value).toBe(
                "Le fichier est trop volumineux. Il doit faire moins de 30 Mo.",
            );
        });

        it("should set error when invalid format", async () => {
            const mockFile = createMockFile("test.pdf", "application/pdf");
            const mockFileList = [mockFile] as unknown as FileList;
            const event = { detail: { files: mockFileList } } as CustomEvent<{ files: FileList | null }>;

            validateFileMock.mockRejectedValue(new FileFormatError("test.pdf"));

            await controller.handleFileChange(event);

            expect(controller.uploadError.value).toBe(true);
            expect(controller.uploadErrorMessage.value).toBe(
                "Ce format de fichier n'est pas supporté. Veuillez déposer un fichier au format CSV, XLS ou XLSX.",
            );
        });

        it("should set error when invalid encoding", async () => {
            const mockFile = createMockFile("test.csv", "text/csv");
            const mockFileList = [mockFile] as unknown as FileList;
            const event = { detail: { files: mockFileList } } as CustomEvent<{ files: FileList | null }>;

            validateFileMock.mockRejectedValue(new FileEncodingError("test.csv", ["UTF-8", "Windows-1252"]));

            await controller.handleFileChange(event);

            expect(controller.uploadError.value).toBe(true);
            expect(controller.uploadErrorMessage.value).toBe(
                "Veuillez déposer un fichier au format CSV, XLS ou XLSX avec encodage UTF-8 ou Windows-1252.",
            );
        });
    });

    describe("clearUploadError", () => {
        it("should clear upload error variables", () => {
            controller.uploadError.set(true);
            controller.uploadErrorMessage.set("Error message");
            controller.noFileOrInvalid.set(true);

            controller.clearUploadError();

            expect(controller.uploadError.value).toBe(false);
            expect(controller.uploadErrorMessage.value).toBe("");
            expect(controller.noFileOrInvalid.value).toBe(false);
        });
    });

    describe("handleValidate", () => {
        beforeEach(() => {
            postScdlFileMock.mockResolvedValue({} as DepositScdlLogResponseDto);
        });

        it("should return when no file selected", async () => {
            await controller.handleValidate();

            expect(getExcelSheetNamesMock).not.toHaveBeenCalled();
            expect(mockDispatch).not.toHaveBeenCalled();
        });

        it("should upload file directly when csv", async () => {
            const mockFile = createMockFile("test.csv", "text/csv");

            const mockFileList = [mockFile] as unknown as FileList;
            const event = { detail: { files: mockFileList } } as CustomEvent<{ files: FileList | null }>;
            validateFileMock.mockResolvedValue();
            await controller.handleFileChange(event);

            getFileExtensionMock.mockReturnValue("csv");

            await controller.handleValidate();

            expect(mockDispatch).toHaveBeenCalledWith("loading");
            expect(postScdlFileMock).toHaveBeenCalledWith(
                mockFile,
                { permissionAlert: true } as DepositScdlLogDto,
                undefined,
            );
            expect(mockDispatch).toHaveBeenCalledWith("nextStep");
        });

        it("should upload file directly when excel with one sheet", async () => {
            const mockFile = createMockFile(
                "test.xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            );

            const mockFileList = [mockFile] as unknown as FileList;
            const event = { detail: { files: mockFileList } } as CustomEvent<{ files: FileList | null }>;
            validateFileMock.mockResolvedValue();
            await controller.handleFileChange(event);

            getExcelSheetNamesMock.mockResolvedValue(["Sheet1"]);
            getFileExtensionMock.mockReturnValue("xlsx");

            await controller.handleValidate();

            expect(mockDispatch).toHaveBeenCalledWith("loading");
            expect(postScdlFileMock).toHaveBeenCalledWith(
                mockFile,
                { permissionAlert: true } as DepositScdlLogDto,
                undefined,
            );
            expect(mockDispatch).toHaveBeenCalledWith("nextStep");
        });

        it("should show sheet selector when multiple sheets", async () => {
            const mockFile = createMockFile(
                "test.xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            );

            const mockFileList = [mockFile] as unknown as FileList;
            const event = { detail: { files: mockFileList } } as CustomEvent<{ files: FileList | null }>;
            validateFileMock.mockResolvedValue();
            await controller.handleFileChange(event);

            const sheets = ["Sheet1", "Sheet2", "Sheet3"];
            getExcelSheetNamesMock.mockResolvedValue(sheets);

            await controller.handleValidate();

            expect(controller.excelSheets.value).toEqual(sheets);
            expect(controller.view.value).toBe("sheetSelector");
            expect(mockDispatch).not.toHaveBeenCalled();
            expect(postScdlFileMock).not.toHaveBeenCalled();
        });
    });

    describe("handleSheetSelected", () => {
        beforeEach(() => {
            postScdlFileMock.mockResolvedValue({ permissionAlert: true } as DepositScdlLogResponseDto);
        });

        it("should upload file with selected sheet", async () => {
            const mockFile = createMockFile(
                "test.xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            );
            const selectedSheet = "Sheet2";

            const mockFileList = [mockFile] as unknown as FileList;
            const fileEvent = { detail: { files: mockFileList } } as CustomEvent<{ files: FileList | null }>;
            validateFileMock.mockResolvedValue();
            await controller.handleFileChange(fileEvent);

            const sheetEvent = { detail: selectedSheet } as CustomEvent<string>;

            await controller.handleSheetSelected(sheetEvent);

            expect(mockDispatch).toHaveBeenCalledWith("loading");
            expect(postScdlFileMock).toHaveBeenCalledWith(
                mockFile,
                { permissionAlert: true } as DepositScdlLogDto,
                selectedSheet,
            );
            expect(mockDispatch).toHaveBeenCalledWith("nextStep");
        });
    });

    describe("handleRestardUpload", () => {
        it("should reset controller state", () => {
            controller.excelSheets.set(["Sheet1", "Sheet2"]);
            controller.view.set("sheetSelector");
            controller.noFileOrInvalid.set(false);

            controller.handleRestartUpload();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect((controller as any).selectedFile).toBe(null);
            expect(controller.noFileOrInvalid.value).toBe(true);
            expect(controller.excelSheets.value).toStrictEqual([]);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect((controller as any).selectedSheet).toBe(undefined);
            expect(controller.view.value).toBe("upload");
        });
    });
});
