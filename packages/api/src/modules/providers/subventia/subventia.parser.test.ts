import fs from "fs";
jest.mock("fs");
import SubventiaParser from "./subventia.parser";

import * as ParseHelper from "../../../shared/helpers/ParserHelper";

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
            //morckReturnValue VS MockResolved for async or mockReturnvlalue Once
            const expected = true;
            //@ts-expect-error : test private method
            const actual = SubventiaParser.filePathValidator(FILEPATH);
            expect(actual).toEqual(expected);
        });
    });

    describe("getBuffer", () => {
        let mockFilePathValidator: jest.Mock;
        beforeEach(() => {
            //@ts-expect-error : test private method
            mockFilePathValidator = jest.spyOn(SubventiaParser, "filePathValidator").mockReturnValue(true);
            // pourquoi ci-dessus ça me donne pas une erreur quand j'attribue
            // une spyInstance à un type Mock ?
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
        let mockFilePathValidator: jest.Mock;
        let mockGetBuffer: jest.Mock;
        let mockXlsParse: jest.Mock;

        beforeEach(() => {
            //@ts-expect-error : test private method
            mockFilePathValidator = jest.spyOn(SubventiaParser, "filePathValidator").mockReturnValue(true);
            //@ts-expect-error : test private method
            mockGetBuffer = jest.spyOn(SubventiaParser, "getBuffer").mockReturnValue(BUFFER);
            //@ts-expect-error : test private method
            mockXlsParse = jest.spyOn(ParseHelper, "xlsParse").mockReturnValue([
                [
                    ["header1", "header2"],
                    ["value1", "value2"],
                    ["value3", "value4"],
                ],
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

        it("should call xlsParse", () => {
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
