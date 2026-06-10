import { ImportReport } from "../../../@types/ImportReport";
import { NotificationType } from "../@types/NotificationType";
import notifyService from "../notify.service";
import { notifyImportFailureUseCase } from "./notify-import-failure.use-case";
import { notifyImportSuccessUseCase } from "./notify-import-success.use-case";

jest.mock("../notify.service", () => ({ notify: jest.fn().mockResolvedValue(true) }));

const PROVIDER_NAME = "TestProvider";
const FILE_PATH = "some/path/data.csv";
const RESULT: ImportReport = { parsedCount: 100, importedCount: 90, errorCount: 10 };
const DURATION_MS = 1500;
const BASE_OPTIONS = { fileCount: 1 };

describe("NotifyImportSuccessUseCase", () => {
    beforeEach(() => jest.clearAllMocks());

    it("calls notifyService.notify with DATA_IMPORT_SUCCESS type", async () => {
        await notifyImportSuccessUseCase.execute(PROVIDER_NAME, FILE_PATH, RESULT, DURATION_MS, BASE_OPTIONS);
        expect(notifyService.notify).toHaveBeenCalledWith(NotificationType.DATA_IMPORT_SUCCESS, expect.anything());
    });

    it("passes providerName from argument", async () => {
        await notifyImportSuccessUseCase.execute(PROVIDER_NAME, FILE_PATH, RESULT, DURATION_MS, BASE_OPTIONS);
        expect(notifyService.notify).toHaveBeenCalledWith(
            NotificationType.DATA_IMPORT_SUCCESS,
            expect.objectContaining({ providerName: PROVIDER_NAME }),
        );
    });

    it("uses basename of file path for details.fileName", async () => {
        await notifyImportSuccessUseCase.execute(PROVIDER_NAME, FILE_PATH, RESULT, DURATION_MS, BASE_OPTIONS);
        const callArgs = jest.mocked(notifyService.notify).mock.calls[0];
        // @ts-expect-error -- details not on all union members
        expect(callArgs[1].details.fileName).toBe("data.csv");
    });

    it("sets all counts and durationMs in details", async () => {
        await notifyImportSuccessUseCase.execute(PROVIDER_NAME, FILE_PATH, RESULT, DURATION_MS, BASE_OPTIONS);
        const callArgs = jest.mocked(notifyService.notify).mock.calls[0];
        // @ts-expect-error -- details not on all union members
        expect(callArgs[1].details).toMatchObject({
            parsedCount: 100,
            importedCount: 90,
            errorCount: 10,
            durationMs: DURATION_MS,
        });
    });

    it("passes optional providerSiret and exportDate from options", async () => {
        const exportDate = new Date("2025-01-01");
        await notifyImportSuccessUseCase.execute(PROVIDER_NAME, FILE_PATH, RESULT, DURATION_MS, {
            fileCount: 1,
            providerSiret: "12345678900001",
            exportDate,
        });
        expect(notifyService.notify).toHaveBeenCalledWith(
            NotificationType.DATA_IMPORT_SUCCESS,
            expect.objectContaining({ providerSiret: "12345678900001", exportDate }),
        );
    });

    it("passes fileCount into details", async () => {
        await notifyImportSuccessUseCase.execute(PROVIDER_NAME, FILE_PATH, RESULT, DURATION_MS, { fileCount: 7 });
        const callArgs = jest.mocked(notifyService.notify).mock.calls[0];
        // @ts-expect-error -- details not on all union members
        expect(callArgs[1].details.fileCount).toBe(7);
    });

    it("sets fileCount to 1 for single-file imports", async () => {
        await notifyImportSuccessUseCase.execute(PROVIDER_NAME, FILE_PATH, RESULT, DURATION_MS, { fileCount: 1 });
        const callArgs = jest.mocked(notifyService.notify).mock.calls[0];
        // @ts-expect-error -- details not on all union members
        expect(callArgs[1].details.fileCount).toBe(1);
    });
});

describe("NotifyImportFailureUseCase", () => {
    const ERROR = new Error("Something went wrong");
    const FILE_NAME = "data.csv";

    beforeEach(() => jest.clearAllMocks());

    it("calls notifyService.notify with DATA_IMPORT_FAILURE type", async () => {
        await notifyImportFailureUseCase.execute(PROVIDER_NAME, ERROR, { fileName: FILE_NAME });
        expect(notifyService.notify).toHaveBeenCalledWith(NotificationType.DATA_IMPORT_FAILURE, expect.anything());
    });

    it("passes providerName from argument", async () => {
        await notifyImportFailureUseCase.execute(PROVIDER_NAME, ERROR, { fileName: FILE_NAME });
        expect(notifyService.notify).toHaveBeenCalledWith(
            NotificationType.DATA_IMPORT_FAILURE,
            expect.objectContaining({ providerName: PROVIDER_NAME }),
        );
    });

    it("passes error.message when given an Error instance", async () => {
        await notifyImportFailureUseCase.execute(PROVIDER_NAME, ERROR, { fileName: FILE_NAME });
        const callArgs = jest.mocked(notifyService.notify).mock.calls[0];
        // @ts-expect-error -- error not on all union members
        expect(callArgs[1].error).toBe(ERROR.message);
    });

    it("passes the string directly when given a string error", async () => {
        await notifyImportFailureUseCase.execute(PROVIDER_NAME, "raw error string", { fileName: FILE_NAME });
        const callArgs = jest.mocked(notifyService.notify).mock.calls[0];
        // @ts-expect-error -- error not on all union members
        expect(callArgs[1].error).toBe("raw error string");
    });

    it("passes fileName into details", async () => {
        await notifyImportFailureUseCase.execute(PROVIDER_NAME, ERROR, { fileName: FILE_NAME });
        const callArgs = jest.mocked(notifyService.notify).mock.calls[0];
        // @ts-expect-error -- details not on all union members
        expect(callArgs[1].details.fileName).toBe(FILE_NAME);
    });

    it("passes durationMs into details when provided in options", async () => {
        await notifyImportFailureUseCase.execute(PROVIDER_NAME, ERROR, { fileName: FILE_NAME, durationMs: 1234 });
        const callArgs = jest.mocked(notifyService.notify).mock.calls[0];
        // @ts-expect-error -- details not on all union members
        expect(callArgs[1].details.durationMs).toBe(1234);
    });

    it("passes optional providerSiret when provided", async () => {
        await notifyImportFailureUseCase.execute(PROVIDER_NAME, ERROR, {
            fileName: FILE_NAME,
            providerSiret: "12345678900001",
        });
        expect(notifyService.notify).toHaveBeenCalledWith(
            NotificationType.DATA_IMPORT_FAILURE,
            expect.objectContaining({ providerSiret: "12345678900001" }),
        );
    });

    it("passes optional exportDate when provided", async () => {
        const exportDate = new Date("2025-01-01");
        await notifyImportFailureUseCase.execute(PROVIDER_NAME, ERROR, { fileName: FILE_NAME, exportDate });
        expect(notifyService.notify).toHaveBeenCalledWith(
            NotificationType.DATA_IMPORT_FAILURE,
            expect.objectContaining({ exportDate }),
        );
    });

    it("passes report counts into details when report is provided", async () => {
        const report = { parsedCount: 5, importedCount: 3, errorCount: 2 };
        await notifyImportFailureUseCase.execute(PROVIDER_NAME, ERROR, { fileName: FILE_NAME, report });
        const callArgs = jest.mocked(notifyService.notify).mock.calls[0];
        // @ts-expect-error -- details not on all union members
        expect(callArgs[1].details).toMatchObject({
            parsedCount: 5,
            importedCount: 3,
            errorCount: 2,
        });
    });

    it("omits count fields from details when report is not provided", async () => {
        await notifyImportFailureUseCase.execute(PROVIDER_NAME, ERROR, { fileName: FILE_NAME });
        const callArgs = jest.mocked(notifyService.notify).mock.calls[0];
        // @ts-expect-error -- details not on all union members
        expect(callArgs[1].details).toEqual({ fileName: FILE_NAME });
    });

    it("sets details to undefined when no options fields are provided", async () => {
        await notifyImportFailureUseCase.execute(PROVIDER_NAME, ERROR, {});
        const callArgs = jest.mocked(notifyService.notify).mock.calls[0];
        // @ts-expect-error -- details not on all union members
        expect(callArgs[1].details).toBeUndefined();
    });
});
