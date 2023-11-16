import * as ParserHelper from "../../../shared/helpers/ParserHelper";
jest.mock("../../../shared/helpers/ParserHelper", () => {
    const original = jest.requireActual("../../../shared/helpers/ParserHelper");
    return { ...original, xlsParse: jest.fn() };
});
const mockedParserHelper = jest.mocked(ParserHelper);
import { printAtSameLine } from "../../../shared/helpers/CliHelper";
jest.mock("../../../shared/helpers/CliHelper");
import ChorusParser from "./chorus.parser";
import { ENTITIES, FILLED_HEADERS, HEADERS, PAGES } from "./__fixutres__/ChorusPages";

describe("ChorusParser", () => {
    describe("renameEmptyHeaders()", () => {
        it("should rename empty headers", () => {
            const expected = FILLED_HEADERS;
            // @ts-expect-error: protected
            const actual = ChorusParser.renameEmptyHeaders(HEADERS);
            expect(actual).toEqual(expected);
        });
    });

    describe("parse()", () => {
        // @ts-expect-error: protected
        const originalRenameEmptyHeaders = ChorusParser.renameEmptyHeaders;
        const mockedRenameEmptyHeaders = jest.fn();
        // @ts-expect-error: protected
        const originalRowsToEntities = ChorusParser.rowsToEntities;
        const mockedRowsToEntities = jest.fn();

        beforeAll(() => {
            mockedParserHelper.xlsParse.mockReturnValue([[HEADERS, ...PAGES]]);
            // @ts-expect-error: protected
            ChorusParser.renameEmptyHeaders = mockedRenameEmptyHeaders;
            mockedRenameEmptyHeaders.mockReturnValue(FILLED_HEADERS);
            // @ts-expect-error: protected
            ChorusParser.rowsToEntities = mockedRowsToEntities;
            mockedRowsToEntities.mockReturnValue(ENTITIES);
        });

        afterAll(() => {
            // @ts-expect-error: protected
            ChorusParser.renameEmptyHeaders = originalRenameEmptyHeaders;
            // @ts-expect-error: protected
            ChorusParser.rowsToEntities = originalRowsToEntities;
        });

        it("should call ParserHelper.xlsParse", () => {
            const CONTENT = "THIS IS A BUFFER";
            // @ts-expect-error
            ChorusParser.parse(CONTENT, () => true);
            expect(mockedParserHelper.xlsParse).toHaveBeenCalledWith(CONTENT);
        });
    });
});
