import fs from "fs";
import CliController from "./CliController";
import { GenericParser } from "./GenericParser";
import dataLogService from "../modules/data-log/dataLog.service";
import { validateDate } from "./helpers/CliHelper";
import notifyService from "../modules/notify/notify.service";
import { NotificationType } from "../modules/notify/@types/NotificationType";

jest.mock("./helpers/CliHelper");
jest.mock("../modules/data-log/dataLog.service");
jest.mock("../modules/notify/notify.service", () => ({ notify: jest.fn().mockResolvedValue(true) }));

describe("CliController", () => {
    const controller = new CliController();
    const FILENAME = "FILENAME";
    const EXPORT_DATE = "2024/07/30";
    const existsSyncMock = jest.spyOn(fs, "existsSync");
    const writeFileSyncMock = jest.spyOn(fs, "writeFileSync").mockImplementation(() => ({}));

    afterAll(() => {
        writeFileSyncMock.mockRestore();
    });

    describe("valideParseFile()", () => {
        it("should throw an error if args is not a string", () => {
            const expected = new Error("Parse command needs file path args");
            let actual;
            try {
                // @ts-expect-error: test private methode
                actual = controller.validParseFile(1234);
            } catch (e) {
                actual = e;
            }
            expect(actual).toEqual(expected);
        });
    });

    describe("validFileExists()", () => {
        it("should throw an error", () => {
            existsSyncMock.mockImplementationOnce(() => false);
            const expected = new Error(`File not found ${FILENAME}`);
            let actual;
            try {
                // @ts-expect-error: test private methode
                actual = controller.validFileExists(FILENAME);
            } catch (e) {
                actual = e;
            }
            expect(actual).toEqual(expected);
        });
        it("should return true", () => {
            existsSyncMock.mockImplementationOnce(() => true);
            // @ts-expect-error: test private methode
            const actual = controller.validFileExists(FILENAME);
            expect(actual).toEqual(true);
        });
    });

    describe("parse()", () => {
        const findFilesMock = jest.spyOn(GenericParser, "findFiles");
        let validFileExistsMock: jest.SpyInstance;
        let _parseSpy: jest.SpyInstance;
        let _notifyMock: jest.SpyInstance;
        let _notifyFailureMock: jest.SpyInstance;
        // @ts-expect-error -- mock protected method
        const logMock = jest.spyOn(controller, "_logImportSuccess").mockResolvedValue(null);

        beforeAll(() => {
            jest.mocked(validateDate).mockReturnValue(true);
            // @ts-expect-error: spy on protected method
            _parseSpy = jest.spyOn(controller, "_parse").mockResolvedValue(undefined);
            // @ts-expect-error: spy on protected method
            _notifyMock = jest.spyOn(controller, "_notifyImportSuccess").mockResolvedValue(undefined);
            // @ts-expect-error: spy on protected method
            _notifyFailureMock = jest.spyOn(controller, "_notifyImportFailure").mockResolvedValue(undefined);
            // @ts-expect-error: spy on protected method
            validFileExistsMock = jest.spyOn(controller, "validFileExists").mockImplementationOnce(() => true);
            jest.spyOn(console, "info").mockImplementation(() => undefined);
            existsSyncMock.mockImplementation(() => true);
            findFilesMock.mockImplementation(() => [FILENAME]);
        });

        afterAll(() => {
            _parseSpy.mockRestore();
            _notifyMock.mockRestore();
            _notifyFailureMock.mockRestore();
            findFilesMock.mockRestore();
            validFileExistsMock.mockRestore();
            logMock.mockRestore();
        });

        beforeEach(() => {
            jest.clearAllMocks();
            jest.mocked(validateDate).mockReturnValue(true);
            findFilesMock.mockImplementation(() => [FILENAME]);
            logMock.mockResolvedValue(null);
            _parseSpy.mockResolvedValue(undefined);
            _notifyMock.mockResolvedValue(undefined);
            _notifyFailureMock.mockResolvedValue(undefined);
        });

        it("should call _parse() one time", async () => {
            const expected = 1;
            await controller.parse(FILENAME, EXPORT_DATE);
            const actual = _parseSpy.mock.calls.length;
            expect(actual).toEqual(expected);
        });

        it("should call _parse() with additional args", async () => {
            await controller.parse(FILENAME, EXPORT_DATE, "some", "other", "thing");
            const actual = _parseSpy.mock.calls[0];
            expect(actual).toMatchObject([FILENAME, [], new Date("2024/07/30"), "some", "other", "thing"]);
        });

        it("should call _parse() multiple times", async () => {
            const FILES = [FILENAME, FILENAME, FILENAME];
            findFilesMock.mockImplementationOnce(() => FILES);
            const expected = FILES.length;
            await controller.parse(FILENAME, EXPORT_DATE);
            const actual = _parseSpy.mock.calls.length;
            expect(actual).toEqual(expected);
        });

        it("logs import", async () => {
            await controller.parse(FILENAME, EXPORT_DATE);
            expect(logMock).toHaveBeenCalledWith(new Date(EXPORT_DATE), FILENAME);
        });

        it("does not call _notifyImportSuccess if _parse returns void", async () => {
            _parseSpy.mockResolvedValue(undefined);
            await controller.parse(FILENAME, EXPORT_DATE);
            expect(_notifyMock).not.toHaveBeenCalled();
        });

        it("calls _notifyImportSuccess with aggregated counts for single file", async () => {
            const FILE_IMPORT_RESULT = { parsedCount: 10, importedCount: 8, errorCount: 2 };
            _parseSpy.mockResolvedValue(FILE_IMPORT_RESULT);
            await controller.parse(FILENAME, EXPORT_DATE);
            expect(_notifyMock).toHaveBeenCalledWith(
                FILENAME,
                new Date(EXPORT_DATE),
                { parsedCount: 10, importedCount: 8, errorCount: 2 },
                expect.any(Number),
                1,
            );
        });

        it("calls _notifyImportSuccess with aggregated counts for multiple files", async () => {
            const FILES = [FILENAME, FILENAME, FILENAME];
            findFilesMock.mockImplementationOnce(() => FILES);
            _parseSpy.mockResolvedValue({ parsedCount: 10, importedCount: 8, errorCount: 2 });
            await controller.parse(FILENAME, EXPORT_DATE);
            expect(_notifyMock).toHaveBeenCalledWith(
                FILENAME,
                new Date(EXPORT_DATE),
                { parsedCount: 30, importedCount: 24, errorCount: 6 },
                expect.any(Number),
                3,
            );
        });

        it("notifies failure if _parse() throws", async () => {
            _parseSpy.mockRejectedValue(new Error("parse failed"));
            await controller.parse(FILENAME, EXPORT_DATE).catch(() => undefined);
            expect(_notifyFailureMock).toHaveBeenCalledTimes(1);
        });

        it("does not notify success if _parse() throws", async () => {
            _parseSpy.mockRejectedValue(new Error("parse failed"));
            await controller.parse(FILENAME, EXPORT_DATE).catch(() => undefined);
            expect(_notifyMock).not.toHaveBeenCalled();
        });

        it("rethrows the error after failure notification", async () => {
            const error = new Error("parse failed");
            _parseSpy.mockRejectedValue(error);
            await expect(controller.parse(FILENAME, EXPORT_DATE)).rejects.toThrow(error);
        });

        it("passes zero partial counts when _parse() throws before any result", async () => {
            _parseSpy.mockRejectedValue(new Error("parse failed"));
            await controller.parse(FILENAME, EXPORT_DATE).catch(() => undefined);
            expect(_notifyFailureMock).toHaveBeenCalledWith(
                FILENAME,
                expect.any(Error),
                expect.any(Date),
                expect.any(Number),
                { parsedCount: 0, importedCount: 0, errorCount: 0 },
            );
        });

        it("passes accumulated partial counts when failure occurs after some files succeed", async () => {
            const FILES = [FILENAME, "FILENAME_2"];
            findFilesMock.mockImplementationOnce(() => FILES);
            _parseSpy
                .mockResolvedValueOnce({ parsedCount: 10, importedCount: 8, errorCount: 2 })
                .mockRejectedValueOnce(new Error("second file failed"));
            await controller.parse(FILENAME, EXPORT_DATE).catch(() => undefined);
            expect(_notifyFailureMock).toHaveBeenCalledWith(
                FILENAME,
                expect.any(Error),
                expect.any(Date),
                expect.any(Number),
                { parsedCount: 10, importedCount: 8, errorCount: 2 },
            );
        });

        it("notifies failure if fs.writeFileSync throws", async () => {
            _parseSpy.mockResolvedValue({ parsedCount: 5, importedCount: 5, errorCount: 0 });
            writeFileSyncMock.mockImplementationOnce(() => {
                throw new Error("disk full");
            });
            await controller.parse(FILENAME, EXPORT_DATE).catch(() => undefined);
            expect(_notifyFailureMock).toHaveBeenCalledTimes(1);
        });

        it("rethrows the error if fs.writeFileSync throws", async () => {
            _parseSpy.mockResolvedValue({ parsedCount: 5, importedCount: 5, errorCount: 0 });
            writeFileSyncMock.mockImplementationOnce(() => {
                throw new Error("disk full");
            });
            await expect(controller.parse(FILENAME, EXPORT_DATE)).rejects.toThrow("disk full");
        });
    });

    describe("_parse()", () => {
        it("should throw error", () => {
            //@ts-expect-error _parse is protected method
            expect(() => controller._parse("", [])).rejects.toThrowError(
                "_parse() need to be implemented by the child class",
            );
        });
    });

    describe("_notifyImportSuccess()", () => {
        const SERVICE_META = { id: "providerId", name: "providerName" };
        const EXPORT_DATE_OBJ = new Date("2024/07/30");
        const FILE_IMPORT_RESULT = { parsedCount: 10, importedCount: 8, errorCount: 2 };

        it("calls notifyService.notify with correct payload", async () => {
            const ctrl = new CliController();
            // @ts-expect-error -- test protected value
            ctrl._serviceMeta = SERVICE_META;
            // @ts-expect-error -- test protected method
            await ctrl._notifyImportSuccess(FILENAME, EXPORT_DATE_OBJ, FILE_IMPORT_RESULT, 1234, 1);
            expect(notifyService.notify).toHaveBeenCalledWith(NotificationType.DATA_IMPORT_SUCCESS, {
                providerName: SERVICE_META.name,
                providerSiret: undefined,
                exportDate: EXPORT_DATE_OBJ,
                details: {
                    fileName: FILENAME,
                    fileCount: 1,
                    parsedCount: 10,
                    importedCount: 8,
                    errorCount: 2,
                    durationMs: 1234,
                },
            });
        });

        it("uses basename of file path for fileName", async () => {
            const ctrl = new CliController();
            // @ts-expect-error -- test protected value
            ctrl._serviceMeta = SERVICE_META;
            // @ts-expect-error -- test protected method
            await ctrl._notifyImportSuccess("some/path/file.csv", EXPORT_DATE_OBJ, FILE_IMPORT_RESULT, 500, 1);
            const callArgs = jest.mocked(notifyService.notify).mock.calls.at(-1)!;
            // @ts-expect-error -- details not on all union members
            expect(callArgs[1].details.fileName).toBe("file.csv");
        });
    });

    describe("_notifyImportFailure()", () => {
        const SERVICE_META = { id: "providerId", name: "providerName" };
        const EXPORT_DATE_OBJ = new Date("2024/07/30");
        const ERROR = new Error("something went wrong");

        it("calls notifyService.notify with correct payload", async () => {
            const ctrl = new CliController();
            // @ts-expect-error -- test protected value
            ctrl._serviceMeta = SERVICE_META;
            // @ts-expect-error -- test protected method
            await ctrl._notifyImportFailure(FILENAME, ERROR, EXPORT_DATE_OBJ, 1234);
            expect(notifyService.notify).toHaveBeenCalledWith(NotificationType.DATA_IMPORT_FAILURE, {
                providerName: SERVICE_META.name,
                providerSiret: undefined,
                exportDate: EXPORT_DATE_OBJ,
                error: ERROR.message,
                details: {
                    fileName: FILENAME,
                    durationMs: 1234,
                },
            });
        });

        it("passes basename of file path as fileName in details", async () => {
            const ctrl = new CliController();
            // @ts-expect-error -- test protected value
            ctrl._serviceMeta = SERVICE_META;
            // @ts-expect-error -- test protected method
            await ctrl._notifyImportFailure("some/path/data.csv", ERROR, EXPORT_DATE_OBJ, 1234);
            const callArgs = jest.mocked(notifyService.notify).mock.calls.at(-1)!;
            // @ts-expect-error -- details not on all union members
            expect(callArgs[1].details.fileName).toBe("data.csv");
        });

        it("forwards partial counts into details when partialResult is provided", async () => {
            const ctrl = new CliController();
            // @ts-expect-error -- test protected value
            ctrl._serviceMeta = SERVICE_META;
            const partialResult = { parsedCount: 3, importedCount: 2, errorCount: 1 };
            // @ts-expect-error -- test protected method
            await ctrl._notifyImportFailure(FILENAME, ERROR, EXPORT_DATE_OBJ, 1234, partialResult);
            const callArgs = jest.mocked(notifyService.notify).mock.calls.at(-1)!;
            // @ts-expect-error -- details not on all union members
            expect(callArgs[1].details).toMatchObject({
                parsedCount: 3,
                importedCount: 2,
                errorCount: 1,
            });
        });

        it("omits count fields from details when partialResult is not provided", async () => {
            const ctrl = new CliController();
            // @ts-expect-error -- test protected value
            ctrl._serviceMeta = SERVICE_META;
            // @ts-expect-error -- test protected method
            await ctrl._notifyImportFailure(FILENAME, ERROR, EXPORT_DATE_OBJ, 1234);
            const callArgs = jest.mocked(notifyService.notify).mock.calls.at(-1)!;
            // @ts-expect-error -- details not on all union members
            const details = callArgs[1].details as Record<string, unknown>;
            expect(details).not.toHaveProperty("parsedCount");
        });
    });

    describe("logImportSuccess", () => {
        const EDITION_DATE = new Date("2023-02-02");

        it("requires '_serviceMeta'", async () => {
            const ctrl = new CliController();
            // @ts-expect-error -- test protected value
            ctrl._serviceMeta = undefined;
            // @ts-expect-error -- test protected method
            const test = () => ctrl._logImportSuccess(EDITION_DATE, FILENAME);
            await expect(test).rejects.toThrow(new Error("'_serviceMeta' needs to be defined by the child class"));
        });

        it("logs import", async () => {
            const SERVICE_META = { id: "providerId", name: "providerName" };
            const ctrl = new CliController();
            // @ts-expect-error -- test protected value
            ctrl._serviceMeta = SERVICE_META;
            // @ts-expect-error -- test protected method
            await ctrl._logImportSuccess(EDITION_DATE, FILENAME);
            expect(dataLogService.addFromFile).toHaveBeenCalledWith({
                providerId: SERVICE_META.id,
                providerName: SERVICE_META.name,
                fileName: FILENAME,
                editionDate: EDITION_DATE,
            });
        });
    });
});
