import * as ParserHelper from "../../../shared/helpers/ParserHelper";
jest.mock("../../../shared/helpers/ParserHelper");
const mockedParserHelper = jest.mocked(ParserHelper);
import chorusService, { ChorusService } from "./chorus.service";
jest.mock("./chorus.service");
const mockedChorusService = jest.mocked(chorusService);
import { printAtSameLine } from "../../../shared/helpers/CliHelper";
jest.mock("../../../shared/helpers/CliHelper");
import ChorusParser from "./chorus.parser";
import { ENTITIES, FILLED_HEADERS, HEADERS, PAGES, PARSED_DATA } from "./__fixutres__/ChorusPages";
import ChorusLineEntity from "./entities/ChorusLineEntity";
import { DEFAULT_CHORUS_LINE_ENTITY } from "./__fixutres__/ChorusLineEntities";

describe("ChorusParser", () => {
    describe("renameEmptyHeaders()", () => {
        it("should rename empty headers", () => {
            const expected = FILLED_HEADERS;
            // @ts-expect-error: protected
            const actual = ChorusParser.renameEmptyHeaders(HEADERS);
            expect(actual).toEqual(expected);
        });
    });

    describe("rowsToEntities", () => {});

    describe("addIndexedInformations", () => {
        it("should add create indexedInformations from parsedData", () => {
            // @ts-expect-error: protected
            ChorusParser.addIndexedInformations({ parsedData: ENTITIES[0].data });
            expect(mockedParserHelper.indexDataByPathObject).toHaveBeenLastCalledWith(
                ChorusLineEntity.indexedInformationsPath,
                ENTITIES[0].data,
            );
        });

        it("should add indexedInformations to the returned object", () => {
            //@ts-expect-error: mock
            mockedParserHelper.indexDataByPathObject.mockReturnValueOnce(ENTITIES[0].indexedInformations);
            const expected = {
                parsedData: ENTITIES[0].data,
                indexedInformations: ENTITIES[0].indexedInformations,
            };
            // @ts-expect-error: protected
            const actual = ChorusParser.addIndexedInformations({ parsedData: ENTITIES[0].data });
            expect(actual).toEqual(expected);
        });
    });

    describe("addUniqueId", () => {
        it("should buildUniqueId from indexedInformations", () => {
            // @ts-expect-error: protected
            ChorusParser.addUniqueId(ENTITIES[0]);
            expect(ChorusService.buildUniqueId).toHaveBeenCalledWith(ENTITIES[0].indexedInformations);
        });

        it("should add uniqueId to the returned object", () => {
            const partialChorusLineEntity = { indexedInformations: ENTITIES[0] };
            const expected = { ...partialChorusLineEntity, uniqueId: ENTITIES[0].uniqueId };
            // @ts-expect-error: protected
            const actual = ChorusParser.addUniqueId(partialChorusLineEntity).uniqueId;
            expect(actual).toEqual(expected);
        });
    });

    describe("mapToEntity", () => {});

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
