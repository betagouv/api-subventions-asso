import fs from "fs";
jest.mock("fs");
import SubventiaParser from "./subventia.parser";

import { GenericParser } from "../../../shared/GenericParser";

const BUFFER = Buffer.from("fileContent");
const FILEPATH = "filePath";
describe("SubventiaParser", () => {
    beforeEach(() => {
        jest.mocked(fs.existsSync).mockReturnValue(true);
        jest.mocked(fs.readFileSync).mockReturnValue(BUFFER);
    });

    describe("filePathValidator", () => {
        it("should throw an error if the file is not a string", () => {
            //@ts-expect-error : test private method
            expect(() => SubventiaParser.filePathValidator()).toThrowError("Parse command need file args");
        });

        it("should throw an error if the file does not exist", () => {
            jest.mocked(fs.existsSync).mockReturnValueOnce(false);
            //@ts-expect-error : test private method
            expect(() => SubventiaParser.filePathValidator(FILEPATH)).toThrowError("File not found ");
        });

        it("should return true if the file exists", () => {
            const expected = true;
            //@ts-expect-error : test private method
            const actual = SubventiaParser.filePathValidator(FILEPATH);
            expect(actual).toEqual(expected);
        });
    });

    describe("getBuffer", () => {
        let mockFilePathValidator: jest.SpyInstance;
        beforeAll(() => {
            //@ts-expect-error : test private method
            mockFilePathValidator = jest.spyOn(SubventiaParser, "filePathValidator").mockReturnValue(true);
        });

        afterAll(() => {
            mockFilePathValidator.mockRestore();
        });

        it("should return the buffer of the file", () => {
            const expected = BUFFER;
            //@ts-expect-error : test private method
            const actual = SubventiaParser.getBuffer(FILEPATH);
            expect(actual).toEqual(expected);
        });

        it("should call filePathValidator", () => {
            //@ts-expect-error : test private method
            SubventiaParser.getBuffer(FILEPATH);
            expect(mockFilePathValidator).toHaveBeenCalledWith(FILEPATH);
        });
    });

    describe("parse", () => {
        let mockFilePathValidator: jest.SpyInstance;
        let mockGetBuffer: jest.SpyInstance;
        let mockXlsParse: jest.SpyInstance;

        beforeAll(() => {
            //@ts-expect-error : test private method
            mockFilePathValidator = jest.spyOn(SubventiaParser, "filePathValidator").mockReturnValue(true);
            //@ts-expect-error : test private method
            mockGetBuffer = jest.spyOn(SubventiaParser, "getBuffer").mockReturnValue(BUFFER);
            mockXlsParse = jest.spyOn(GenericParser, "xlsxParse").mockReturnValue([
                {
                    data: [
                        ["header1", "header2"],
                        ["value1", "value2"],
                        ["value3", "value4"],
                    ],
                    name: "page1",
                },
            ]);
        });

        afterAll(() => {
            mockFilePathValidator.mockRestore();
            mockGetBuffer.mockRestore();
            mockXlsParse.mockRestore();
        });

        it("should call filePathValidator", () => {
            SubventiaParser.parse("file");
            expect(mockFilePathValidator).toHaveBeenCalledWith("file");
        });

        it("should call getBuffer", () => {
            SubventiaParser.parse("file");
            expect(mockGetBuffer).toHaveBeenCalledWith("file");
        });

        it("should call xlsxParse", () => {
            SubventiaParser.parse("file");
            expect(mockXlsParse).toHaveBeenCalledWith(BUFFER);
        });

        it("should return parsed data", () => {
            const expected = [
                { header1: "value1", header2: "value2" },
                { header1: "value3", header2: "value4" },
            ];

            const actual = SubventiaParser.parse("file");
            expect(actual).toEqual(expected);
        });
    });
});
