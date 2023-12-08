import path from "path";
import fs from "fs";
import ScdlGrantParser from "./scdl.grant.parser";
import MiscScdlGrant from "./__fixtures__/MiscScdlGrant";
import * as Validators from "../../../shared/Validators";
jest.mock("../../../shared/Validators");
const mockedValidators = jest.mocked(Validators);
import * as DateHelper from "../../../shared/helpers/DateHelper";
jest.mock("../../../shared/helpers/DateHelper");
const mockedDateHelper = jest.mocked(DateHelper);
import * as ParserHelper from "../../../shared/helpers/ParserHelper";
import { SCDL_HEADERS, SCDL_ROWS } from "./__fixtures__/RawData";
jest.mock("../../../shared/helpers/ParserHelper");
const mockedParserHelper = jest.mocked(ParserHelper);

describe("ScdlGrantParser", () => {
    describe("parseCsv", () => {
        const BUFFER = Buffer.alloc(1);
        const mockIsGrantValid = jest.fn();
        // @ts-expect-error: protected
        const originalIsGrantValid = ScdlGrantParser.isGrantValid;

        beforeEach(() => {
            mockedParserHelper.csvParse.mockReturnValue([SCDL_HEADERS, ...SCDL_ROWS]);
            // @ts-expect-error: mock protected static method
            ScdlGrantParser.isGrantValid = mockIsGrantValid.mockReturnValue(true);
        });

        // @ts-expect-error: unmock protected static method
        afterAll(() => (ScdlGrantParser.isGrantValid = originalIsGrantValid));

        it("should call ParserHelper.csvParse", () => {
            ScdlGrantParser.parseCsv(BUFFER);
            expect(mockedParserHelper.csvParse).toHaveBeenCalledWith(BUFFER, ";");
        });

        it("should link and index data for each rows", () => {
            ScdlGrantParser.parseCsv(BUFFER);
            expect(mockedParserHelper.linkHeaderToData).toHaveBeenCalledTimes(SCDL_ROWS.length);
            expect(mockedParserHelper.indexDataByPathObject).toHaveBeenCalledTimes(SCDL_ROWS.length);
        });

        it("should return storableChunk", () => {
            // @ts-expect-error: mock
            mockedParserHelper.linkHeaderToData.mockImplementation((header, row) => row);
            // @ts-expect-error: mock
            mockedParserHelper.indexDataByPathObject.mockImplementation((mapper, row) => row);
            const expected = SCDL_ROWS;
            const actual = ScdlGrantParser.parseCsv(BUFFER);
            expect(actual).toEqual(expected);
        });
    });

    describe("isGrantValid", () => {
        const GRANT = { ...MiscScdlGrant };

        beforeEach(() => {
            mockedValidators.isSiret.mockReturnValue(true);
        });

        it("should return false if siret not valid", () => {
            mockedValidators.isSiret.mockReturnValueOnce(false);
            const expected = false;
            // @ts-expect-error: protected method
            const actual = ScdlGrantParser.isGrantValid(GRANT);
            expect(actual).toEqual(expected);
        });

        it("should return false if date not valid", () => {
            mockedDateHelper.isValidDate.mockReturnValueOnce(false);
            const expected = false;
            // @ts-expect-error: protected method
            const actual = ScdlGrantParser.isGrantValid(GRANT);
            expect(actual).toEqual(expected);
        });
    });
});
