import fs from "fs";

jest.mock("fs");
import FonjepParser from "./fonjep.parser";
import { GenericParser } from "../../../shared/GenericParser";

const BUFFER = Buffer.from("fileContent");
const FILEPATH = "filePath";
const PAGE = [
    ["foo", "bar"],
    ["foo1", "bar1"],
    ["foo2", "bar2"],
];

const PAGES = { Tiers: PAGE, Poste: PAGE, Versement: PAGE, TypePoste: PAGE, Dispositif: PAGE };
const PAGES_LIST = [PAGE, PAGE, PAGE, PAGE, PAGE];

const MAPPED_DATA_ELEMENT = [
    { foo: "foo1", bar: "bar1" },
    { foo: "foo2", bar: "bar2" },
];

const MAPPED_DATA = [
    MAPPED_DATA_ELEMENT,
    MAPPED_DATA_ELEMENT,
    MAPPED_DATA_ELEMENT,
    MAPPED_DATA_ELEMENT,
    MAPPED_DATA_ELEMENT,
];

const PARSED_DATA = {
    tiers: MAPPED_DATA_ELEMENT,
    postes: MAPPED_DATA_ELEMENT,
    versements: MAPPED_DATA_ELEMENT,
    typePoste: MAPPED_DATA_ELEMENT,
    dispositifs: MAPPED_DATA_ELEMENT,
};

describe("FonjepParser", () => {
    beforeEach(() => {
        jest.mocked(fs.existsSync).mockReturnValue(true);
        jest.mocked(fs.readFileSync).mockReturnValue(BUFFER);
    });

    describe("filePathValidator", () => {
        it("should throw an error if the file path is not given", () => {
            //@ts-expect-error: test private method
            expect(() => FonjepParser.filePathValidator()).toThrowError("Parse command need file args");
        });

        it("should throw an error if the file does not exist", () => {
            jest.mocked(fs.existsSync).mockReturnValueOnce(false);
            //@ts-expect-error: test private method
            expect(() => FonjepParser.filePathValidator(FILEPATH)).toThrowError("File not found filePath");
        });

        it("should return true if the file exists", () => {
            const expected = true;
            //@ts-expect-error: test private method
            const actual = FonjepParser.filePathValidator(FILEPATH);
            expect(actual).toEqual(expected);
        });
    });

    describe("getBuffer", () => {
        let mockFilePathValidator: jest.SpyInstance;
        beforeAll(() => {
            //@ts-expect-error: test private method
            mockFilePathValidator = jest.spyOn(FonjepParser, "filePathValidator").mockReturnValue(true);
        });

        afterAll(() => {
            mockFilePathValidator.mockRestore();
        });

        it("should return the buffer of the file", () => {
            const expected = BUFFER;
            //@ts-expect-error: test private method
            const actual = FonjepParser.getBuffer(FILEPATH);
            expect(actual).toEqual(expected);
        });

        it("should call filePathValidator", () => {
            //@ts-expect-error: test private method
            FonjepParser.getBuffer(FILEPATH);
            expect(mockFilePathValidator).toHaveBeenCalledWith(FILEPATH);
        });
    });

    describe("mapHeaderToData", () => {
        it("should return a map object with header ad property name", () => {
            const expected = MAPPED_DATA;
            // @ts-expect-error: test private method
            const actual = FonjepParser.mapHeaderToData(PAGES_LIST);
            expect(actual).toEqual(expected);
        });
    });

    describe("parse", () => {
        let mockGetBuffer: jest.SpyInstance;
        let mockXlsParse: jest.SpyInstance;
        let mockMapHeaderToData: jest.SpyInstance;

        beforeAll(() => {
            // @ts-expect-error: test private method
            mockGetBuffer = jest.spyOn(FonjepParser, "getBuffer").mockReturnValue(BUFFER);
            mockXlsParse = jest.spyOn(GenericParser, "xlsParseByPageName").mockReturnValue(PAGES);
            // @ts-expect-error: test private method
            mockMapHeaderToData = jest.spyOn(FonjepParser, "mapHeaderToData").mockReturnValue(MAPPED_DATA);
        });

        afterAll(() => {
            mockGetBuffer.mockRestore();
            mockXlsParse.mockRestore();
            mockMapHeaderToData.mockRestore();
        });

        it("should call getBuffer", () => {
            FonjepParser.parse(FILEPATH);
            expect(mockGetBuffer).toHaveBeenCalledWith(FILEPATH);
        });

        it("should call xlsParse", () => {
            FonjepParser.parse(FILEPATH);
            expect(mockXlsParse).toHaveBeenCalledWith(BUFFER);
        });

        it("should call mapHeaderToData", () => {
            FonjepParser.parse(FILEPATH);
            expect(mockMapHeaderToData).toHaveBeenCalledWith(PAGES_LIST);
        });

        it("should return an object with tiers, postes, versements, typePoste, dispositifs", () => {
            const expected = PARSED_DATA;
            const actual = FonjepParser.parse(FILEPATH);
            expect(actual).toEqual(expected);
        });
    });
});
