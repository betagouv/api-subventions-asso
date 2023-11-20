import * as ParserHelper from "../../../shared/helpers/ParserHelper";
jest.mock("../../../shared/helpers/ParserHelper");
const mockedParserHelper = jest.mocked(ParserHelper);
import chorusService, { ChorusService } from "./chorus.service";
jest.mock("./chorus.service");
const mockedChorusService = jest.mocked(chorusService);
import { printAtSameLine } from "../../../shared/helpers/CliHelper";
jest.mock("../../../shared/helpers/CliHelper");
import ChorusParser from "./chorus.parser";
import { ENTITIES, FILLED_HEADERS, HEADERS, PAGES } from "./__fixutres__/ChorusFixtures";
import ChorusLineEntity from "./entities/ChorusLineEntity";
jest.mock("./entities/ChorusLineEntity");

describe("ChorusParser", () => {
    describe("renameEmptyHeaders()", () => {
        it("should rename empty headers", () => {
            const expected = FILLED_HEADERS;
            // @ts-expect-error: protected
            const actual = ChorusParser.renameEmptyHeaders(HEADERS);
            expect(actual).toEqual(expected);
        });
    });

    describe("rowsToEntities", () => {
        // @ts-expect-error: protected
        let originalAddIndexedInformations = ChorusParser.addIndexedInformations;
        // @ts-expect-error: protected
        let originalAddUniqueId = ChorusParser.addUniqueId;
        // @ts-expect-error: protected
        let originalMapToEntity = ChorusParser.mapToEntity;
        let validator = jest.fn().mockReturnValue(true);
        const mockAddIndexedInformations = jest.fn();
        const mockAddUniqueId = jest.fn();
        const mockMapToEntity = jest.fn();

        const ROWS = [...PAGES];

        beforeAll(() => {
            // @ts-expect-error: protected
            ChorusParser.addIndexedInformations = mockAddIndexedInformations;
            // @ts-expect-error: protected
            ChorusParser.addUniqueId = mockAddUniqueId;
            // @ts-expect-error: protected
            ChorusParser.mapToEntity = mockMapToEntity;
        });

        afterAll(() => {
            // @ts-expect-error: protected
            ChorusParser.addIndexedInformations = originalAddIndexedInformations;
            // @ts-expect-error: protected
            ChorusParser.addUniqueId = originalAddUniqueId;
            // @ts-expect-error: protected
            ChorusParser.mapToEntity = originalMapToEntity;
        });

        it.each`
            fn
            ${ParserHelper.linkHeaderToData}
            ${mockAddIndexedInformations}
            ${mockAddUniqueId}
            ${mockMapToEntity}
        `("should call $fn", ({ fn }) => {
            // @ts-expect-error: protected
            ChorusParser.rowsToEntities([], ROWS, validator);
            expect(fn).toHaveBeenCalledTimes(ROWS.length);
        });
    });

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
        const UNIQUE_ID = "unique-id";
        const originalBuildUniqueId = ChorusService.buildUniqueId;
        beforeAll(() => {
            ChorusService.buildUniqueId = jest.fn().mockReturnValue(UNIQUE_ID);
        });

        afterAll(() => {
            ChorusService.buildUniqueId = originalBuildUniqueId;
        });

        it("should buildUniqueId from indexedInformations", () => {
            // @ts-expect-error: protected
            ChorusParser.addUniqueId(ENTITIES[0]);
            expect(ChorusService.buildUniqueId).toHaveBeenCalledWith(ENTITIES[0].indexedInformations);
        });

        it("should add uniqueId to the returned object", () => {
            const partialChorusLineEntity = { indexedInformations: ENTITIES[0] };
            const expected = { ...partialChorusLineEntity, uniqueId: UNIQUE_ID };
            // @ts-expect-error: protected
            const actual = ChorusParser.addUniqueId(partialChorusLineEntity);
            expect(actual).toEqual(expected);
        });
    });

    describe("mapToEntity", () => {
        it("should create new ChorusLineEntity", () => {
            const fixture = ENTITIES[0];
            const almostEntity = {
                parsedData: fixture.data,
                indexedInformations: fixture.indexedInformations,
                uniqueId: fixture.uniqueId,
            };
            // @ts-expect-error: protected
            // test it as a real mapper
            [almostEntity].map(ChorusParser.mapToEntity);
            expect(ChorusLineEntity).toHaveBeenCalledWith(
                almostEntity.uniqueId,
                almostEntity.indexedInformations,
                almostEntity.parsedData,
            );
        });

        it("should map to entity", () => {
            const fixture = ENTITIES[0];
            const almostEntity = {
                parsedData: fixture.data,
                indexedInformations: fixture.indexedInformations,
                uniqueId: fixture.uniqueId,
            };
            // @ts-expect-error: protected
            // test it as a real mapper
            const actual = [almostEntity].map(ChorusParser.mapToEntity);
            const expected = [expect.any(ChorusLineEntity)];
            expect(actual).toEqual(expected);
        });
    });

    describe("validateEntity", () => {
        beforeAll(() => {
            mockedChorusService.validateEntity.mockReturnValue(true);
        });

        it("should return true", () => {
            const expected = true;
            //@ts-expect-error: protected
            const actual = ChorusParser.validateEntity(ENTITIES[0]);
            expect(actual).toEqual(expected);
        });

        it("should return false", () => {
            mockedChorusService.validateEntity.mockImplementationOnce(() => {
                throw new Error();
            });
            const expected = false;
            //@ts-expect-error: protected
            const actual = ChorusParser.validateEntity(ENTITIES[0]);
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
