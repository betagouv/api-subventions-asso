import fs from "fs";
import CliController from "./CliController";
import { GenericParser } from "./GenericParser";
import dataLogService from "../modules/data-log/dataLog.service";
import { validateDate } from "./helpers/CliHelper";
// import notifyService from "../modules/notify/notify.service";
// import { NotificationType } from "../modules/notify/@types/NotificationType";
import { ImportNotifier } from "../adapters/inputs/pipeline/import/import-notifier";

jest.mock("./helpers/CliHelper");
jest.mock("../modules/data-log/dataLog.service");
jest.mock("../modules/notify/notify.service", () => ({ notify: jest.fn().mockResolvedValue(true) }));

describe("CliController", () => {
    const mockNotifier = {
        notifySuccess: jest.fn(),
        notifyFailure: jest.fn(),
    } as unknown as jest.Mocked<ImportNotifier>;

    const SERVICE_META = { id: "providerId", name: "providerName" };

    const IMPORT_RESULT = {
        parsedCount: 10,
        importedCount: 9,
        errorCount: 1,
    };

    class TestCliController extends CliController {
        _serviceMeta = SERVICE_META;

        async _parse(_filePath: string) {
            console.log("inside _parse");
            return Promise.resolve(IMPORT_RESULT);
        }
    }
    let controller = new TestCliController(mockNotifier);

    beforeEach(() => (controller = new TestCliController(mockNotifier)));

    const FILENAME = "FILENAME";
    const EXPORT_DATE = "2024-07-30";

    const writeFileSyncMock = jest.spyOn(fs, "writeFileSync").mockImplementation(() => ({}));

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
        const existsSyncMock = jest.spyOn(fs, "existsSync");
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
        const EXPORT_DATE_OBJ = new Date(EXPORT_DATE);
        const FILES = [FILENAME, FILENAME, FILENAME];
        // const ERROR = new Error("something went wrong");
        // const EDITION_DATE = new Date("2023-02-02");
        const findFilesMock = jest.spyOn(GenericParser, "findFiles");
        let validFileExistsMock: jest.SpyInstance;
        let mockParse: jest.SpyInstance;
        let logMock: jest.SpyInstance;
        let mockValidFileExists: jest.SpyInstance;

        beforeEach(() => {
            mockParse = jest.spyOn(controller, "_parse");
            // @ts-expect-error: mock private method
            mockValidFileExists = jest.spyOn(controller, "validFileExists").mockReturnValue(true);
            // @ts-expect-error -- mock protected method
            logMock = jest.spyOn(controller, "_logImportSuccess").mockResolvedValue();
            jest.mocked(validateDate).mockReturnValue(true);
            // @ts-expect-error: spy on protected method
            validFileExistsMock = jest.spyOn(controller, "validFileExists").mockImplementationOnce(() => true);
            findFilesMock.mockImplementation(() => [FILENAME]);
        });

        afterAll(() => {
            validFileExistsMock.mockRestore();
        });

        beforeEach(() => {
            jest.mocked(validateDate).mockReturnValue(true);
            findFilesMock.mockImplementation(() => [FILENAME]);
        });

        it("validates if file exists", async () => {
            await controller.parse(FILENAME, EXPORT_DATE);
            expect(mockValidFileExists).toHaveBeenCalledTimes(1);
        });

        it("should call _parse() one time", async () => {
            await controller.parse(FILENAME, EXPORT_DATE);
            expect(mockParse).toHaveBeenCalledWith(FILENAME, [], EXPORT_DATE_OBJ); // [] for empty log that should be refactored
        });

        it("should call _parse() with additional args", async () => {
            await controller.parse(FILENAME, EXPORT_DATE, "some", "other", "thing");
            expect(mockParse).toHaveBeenCalledWith(FILENAME, [], EXPORT_DATE_OBJ, "some", "other", "thing"); // [] for empty log that should be refactored
        });

        it("should call _parse() multiple times", async () => {
            findFilesMock.mockImplementationOnce(() => FILES);
            await controller.parse(FILENAME, EXPORT_DATE);
            expect(mockParse).toHaveBeenCalledTimes(FILES.length);
        });

        it("logs import", async () => {
            await controller.parse(FILENAME, EXPORT_DATE);
            expect(logMock).toHaveBeenCalledWith(new Date(EXPORT_DATE), FILENAME);
        });

        it("rethrows the error if fs.writeFileSync throws", async () => {
            writeFileSyncMock.mockImplementationOnce(() => {
                throw new Error("disk full");
            });
            await expect(controller.parse(FILENAME, EXPORT_DATE)).rejects.toThrow("disk full");
        });

        it("notify import success", async () => {
            await controller.parse(FILENAME, EXPORT_DATE);
            expect(mockNotifier.notifySuccess).toHaveBeenCalledWith({
                providerName: controller._serviceMeta.name,
                file: FILENAME,
                report: IMPORT_RESULT,
                context: {
                    durationMs: expect.any(Number),
                    exportDate: EXPORT_DATE_OBJ,
                    fileCount: 1,
                },
            });
        });

        it("notify import failure", async () => {
            const ERROR = new Error("somthing wrong");
            mockParse
                .mockImplementation()
                .mockResolvedValueOnce(IMPORT_RESULT)
                .mockResolvedValueOnce(IMPORT_RESULT)
                .mockRejectedValueOnce(ERROR);
            findFilesMock.mockImplementationOnce(() => FILES);
            try {
                await controller.parse(FILENAME, EXPORT_DATE);
            } catch {
                expect(mockNotifier.notifyFailure).toHaveBeenCalledWith({
                    providerName: controller._serviceMeta.name,
                    error: ERROR,
                    context: {
                        fileName: FILENAME,
                        exportDate: EXPORT_DATE_OBJ,
                        durationMs: expect.any(Number),
                        report: { parsedCount: 20, importedCount: 18, errorCount: 2 },
                    },
                });
            }
        });
    });

    describe("_parse()", () => {
        class NoParseCli extends CliController {}
        const controller = new NoParseCli(mockNotifier);
        it("should throw error", () => {
            //@ts-expect-error _parse is protected method
            expect(() => controller._parse("", [])).rejects.toThrow(
                "_parse() need to be implemented by the child class",
            );
        });
    });

    describe("logImportSuccess", () => {
        const EDITION_DATE = new Date("2023-02-02");

        it("requires '_serviceMeta'", async () => {
            // @ts-expect-error: edge case
            controller._serviceMeta = undefined;
            // @ts-expect-error -- test protected method
            await expect(() => controller._logImportSuccess(EDITION_DATE, FILENAME)).rejects.toThrow(
                new Error("'_serviceMeta' needs to be defined by the child class"),
            );
        });

        it("logs import", async () => {
            // @ts-expect-error -- test protected method
            await controller._logImportSuccess(EDITION_DATE, FILENAME);
            expect(dataLogService.addFromFile).toHaveBeenCalledWith({
                providerId: SERVICE_META.id,
                providerName: SERVICE_META.name,
                fileName: FILENAME,
                editionDate: EDITION_DATE,
            });
        });
    });
});
