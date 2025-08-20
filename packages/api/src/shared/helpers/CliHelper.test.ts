import { FormatDateError } from "../errors/cliErrors/FormatDateError";
import { ObsoleteDateError } from "../errors/cliErrors/ObsoleteDateError";
import { OutOfRangeDateError } from "../errors/cliErrors/OutOfRangeDateError";
import * as CliHelper from "./CliHelper";

import fs from "fs";
jest.mock("fs");
import jschardet from "jschardet";
jest.mock("jschardet");

describe("CliHelper", () => {
    describe("validateDate()", () => {
        it.each`
            date
            ${"23-01-2025"}
            ${"23-01--2025"}
            ${"A23-01-2025"}
        `("throws error if date format is invalid", () => {
            expect(() => CliHelper.validateDate("23-01-2025")).toThrowError(FormatDateError);
        });

        it("throws error if date is < 2018", () => {
            expect(() => CliHelper.validateDate("2017-01-01")).toThrowError(ObsoleteDateError);
        });

        it("throws error if date is greater than today", () => {
            const today = new Date("2025-01-01");
            const tomorrowStr = "2025-01-02";
            jest.useFakeTimers().setSystemTime(today);
            expect(() => CliHelper.validateDate(tomorrowStr)).toThrowError(OutOfRangeDateError);
            jest.useRealTimers();
        });
    });

    describe("detectAndEncode", () => {
        const DETECTED_LIST = ["UTF-8", "windows-1252"];
        const FILE_PATH = "path/to/file";
        const BUFFER = Buffer.from("foo;bar;");
        const DETECTED_MAP = { encoding: DETECTED_LIST[1] }; // something not utf-8

        beforeAll(() => {
            jest.spyOn(fs, "readFileSync").mockReturnValue(BUFFER);
            // @ts-expect-error: mock return value
            jest.spyOn(jschardet, "detect").mockReturnValue(DETECTED_MAP);
        });

        it("get buffer from filePath", () => {
            CliHelper.detectAndEncode(FILE_PATH);
            expect(fs.readFileSync).toHaveBeenNthCalledWith(1, FILE_PATH);
        });

        it("find encoding", () => {
            CliHelper.detectAndEncode(FILE_PATH);
            expect(jschardet.detect).toHaveBeenCalledWith(BUFFER);
        });

        // add a new each option when you add a new encoding
        it.each`
            fileEncoding        | fsEncoding
            ${DETECTED_LIST[0]} | ${"binary"}
        `("encode $fileEncoding to UTF-8", ({ fsEncoding }) => {
            CliHelper.detectAndEncode(FILE_PATH);
            expect(fs.readFileSync).toHaveBeenNthCalledWith(2, FILE_PATH, fsEncoding);
        });

        it("does not encode if already in UTF-8", () => {
            // @ts-expect-error: mock return value
            jest.spyOn(jschardet, "detect").mockReturnValue({ encoding: DETECTED_LIST[0] }); // utf-8
            CliHelper.detectAndEncode(FILE_PATH);
            expect(fs.readFileSync).toHaveBeenCalledTimes(1);
        });
    });
});
