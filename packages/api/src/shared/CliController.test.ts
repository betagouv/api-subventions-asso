import fs from "fs";
import CliController from "./CliController";
import { GenericParser } from "./GenericParser";

describe("CliController", () => {
    const controller = new CliController();
    const FILENAME = "FILENAME";
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

        beforeAll(() => {
            // @ts-expect-error: spy on protected method
            _parseSpy = jest.spyOn(controller, "_parse").mockImplementation(() => true);
            // @ts-expect-error: spy on protected method
            validFileExistsMock = jest.spyOn(controller, "validFileExists").mockImplementationOnce(() => true);
            jest.spyOn(console, "info").mockImplementation(() => undefined);
            existsSyncMock.mockImplementation(() => true);
        });

        afterEach(() => {
            findFilesMock.mockReset();
        });

        afterAll(() => {
            _parseSpy.mockRestore();
            validFileExistsMock.mockRestore();
        });

        it("should call _parse() one time", async () => {
            findFilesMock.mockImplementationOnce(() => [FILENAME]);
            const expected = 1;
            await controller.parse(FILENAME);
            const actual = _parseSpy.mock.calls.length;
            expect(actual).toEqual(expected);
        });
        it("should call _parse() multiple times", async () => {
            const FILES = [FILENAME, FILENAME, FILENAME];
            findFilesMock.mockImplementationOnce(() => FILES);
            const expected = FILES.length;
            await controller.parse(FILENAME);
            const actual = _parseSpy.mock.calls.length;
            expect(actual).toEqual(expected);
        });
        it("should call _parse() with a specific export date", async () => {
            const LOGS: unknown[] = [];
            const exportDate = "2022-03-03";
            findFilesMock.mockImplementationOnce(() => [FILENAME]);
            const expected = new Date(exportDate);
            await controller.parse(FILENAME, exportDate);
            expect(_parseSpy).toHaveBeenCalledWith(FILENAME, LOGS, expected);
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
});
