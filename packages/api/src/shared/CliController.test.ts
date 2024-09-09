import fs from "fs";
import CliController from "./CliController";
import { GenericParser } from "./GenericParser";
import dataLogService from "../modules/data-log/dataLog.service";

jest.mock("../modules/data-log/dataLog.service");

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
        // @ts-expect-error -- mock protected method
        const logMock = jest.spyOn(controller, "_logImportSuccess").mockResolvedValue(null);

        beforeAll(() => {
            // @ts-expect-error: spy on protected method
            _parseSpy = jest.spyOn(controller, "_parse").mockImplementation(() => true);
            // @ts-expect-error: spy on protected method
            validFileExistsMock = jest.spyOn(controller, "validFileExists").mockImplementationOnce(() => true);
            jest.spyOn(console, "info").mockImplementation(() => undefined);
            existsSyncMock.mockImplementation(() => true);
            findFilesMock.mockImplementation(() => [FILENAME]);
        });

        afterAll(() => {
            _parseSpy.mockRestore();
            findFilesMock.mockRestore();
            validFileExistsMock.mockRestore();
            logMock.mockRestore();
        });

        it.each`
            date
            ${"224-07-30"}
            ${"2017-07-30"}
        `("throw out of range (lower) error with export year below 2018", async ({ date }) => {
            await expect(() => controller.parse(FILENAME, date)).rejects.toThrowError("We only import data since 2018");
        });

        it("throw invalid date error", async () => {
            await expect(() => controller.parse(FILENAME, "20024-07-30")).rejects.toThrowError(
                "Export date out of range",
            );
        });

        it("throw out of range (greater) error with export date greater than today", async () => {
            const today = new Date();
            const tomorrow = new Date(today.setDate(today.getDate() + 1));
            await expect(() => controller.parse(FILENAME, tomorrow.toISOString())).rejects.toThrowError(
                "Export date out of range",
            );
        });

        it("should call _parse() one time", async () => {
            const expected = 1;
            await controller.parse(FILENAME, EXPORT_DATE);
            const actual = _parseSpy.mock.calls.length;
            expect(actual).toEqual(expected);
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
    });

    describe("_parse()", () => {
        it("should throw error", () => {
            //@ts-expect-error _parse is protected method
            expect(() => controller._parse("", [])).rejects.toThrowError(
                "_parse() need to be implemented by the child class",
            );
        });
    });

    describe("logImportSuccess", () => {
        const EDITION_DATE = new Date("2023-02-02");

        it("requires '_providerIdToLog'", async () => {
            const ctrl = new CliController();
            // @ts-expect-error -- test protected value
            ctrl._providerIdToLog = "";
            // @ts-expect-error -- test protected method
            const test = () => ctrl._logImportSuccess(EDITION_DATE, FILENAME);
            await expect(test).rejects.toThrowError(
                new Error("'_providerIdToLog' needs to be defined by the child class"),
            );
        });

        it("logs import", async () => {
            const ctrl = new CliController();
            // @ts-expect-error -- test protected value
            ctrl._providerIdToLog = "something";
            // @ts-expect-error -- test protected method
            await ctrl._logImportSuccess(EDITION_DATE, FILENAME);
            expect(dataLogService.addLog).toHaveBeenCalledWith("something", EDITION_DATE, FILENAME);
        });
    });
});
