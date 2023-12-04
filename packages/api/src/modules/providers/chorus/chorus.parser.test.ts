import * as ParserHelper from "../../../shared/helpers/ParserHelper";
jest.mock("../../../shared/helpers/ParserHelper");
const mockedParserHelper = jest.mocked(ParserHelper);
import { printAtSameLine } from "../../../shared/helpers/CliHelper";
jest.mock("../../../shared/helpers/CliHelper");
import ChorusParser from "./chorus.parser";
import { ENTITIES, FILLED_HEADERS, HEADERS, PAGES } from "./__fixutres__/ChorusFixtures";
import ChorusLineEntity from "./entities/ChorusLineEntity";
jest.mock("./entities/ChorusLineEntity");
import * as StringHelper from "../../../shared/helpers/StringHelper";
jest.mock("../../../shared/helpers/StringHelper");
const mockedStringHelper = jest.mocked(StringHelper);

describe("ChorusParser", () => {
    describe("buildUniqueId", () => {
        it("call getMD5", () => {
            const info = ENTITIES[0].indexedInformations;
            // @ts-expect-error: protected
            ChorusParser.buildUniqueId(info);
            expect(mockedStringHelper.getMD5).toHaveBeenCalledWith(
                `${info.ej}-${info.siret}-${info.dateOperation.toISOString()}-${info.amount}-${
                    info.numeroDemandePayment
                }-${info.codeCentreFinancier}-${info.codeDomaineFonctionnel}`,
            );
        });
    });

    describe("validateIndexedInformations", () => {
        it("rejects because codeBranche is not accepted", () => {
            const indexedInformations = { ...ENTITIES[0].indexedInformations, codeBranche: "WRONG CODE" };

            //@ts-expect-error: protected
            expect(() => ChorusParser.validateIndexedInformations(indexedInformations)).toThrow(
                `The branch ${indexedInformations.codeBranche} is not accepted in data`,
            );
        });

        it("rejects because amount is not a number", () => {
            const indexedInformations = { ...ENTITIES[0].indexedInformations, amount: undefined };
            //@ts-expect-error: protected
            expect(() => ChorusParser.validateIndexedInformations(indexedInformations)).toThrow(
                `Amount is not a number`,
            );
        });

        it("rejects dateOperation is not a Date", () => {
            const indexedInformations = { ...ENTITIES[0].indexedInformations, dateOperation: "01/01/1960" };
            //@ts-expect-error: protected
            expect(() => ChorusParser.validateIndexedInformations(indexedInformations)).toThrow(
                `Operation date is not a valid date`,
            );
        });

        it("rejects because siret is not valid", () => {
            const indexedInformations = { ...ENTITIES[0].indexedInformations, siret: "SIRET" };
            //@ts-expect-error: protected
            expect(() => ChorusParser.validateIndexedInformations(indexedInformations)).toThrow(
                `INVALID SIRET FOR ${indexedInformations.siret}`,
            );
        });

        it("should return true if siret equals #", () => {
            const indexedInformations = { ...ENTITIES[0].indexedInformations, siret: "#" };
            //@ts-expect-error: protected
            expect(ChorusParser.validateIndexedInformations(indexedInformations)).toEqual(true);
        });

        it("rejects because ej is not valid", () => {
            const indexedInformations = { ...ENTITIES[0].indexedInformations, ej: "00000" };
            //@ts-expect-error: protected
            expect(() => ChorusParser.validateIndexedInformations(indexedInformations)).toThrow(
                `INVALID EJ FOR ${indexedInformations.ej}`,
            );
        });

        it("accepts", () => {
            const indexedInformations = ENTITIES[0].indexedInformations;
            //@ts-expect-error: protected
            expect(ChorusParser.validateIndexedInformations(indexedInformations)).toEqual(true);
        });
    });

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
        let originalBuildUniqueId = ChorusParser.buildUniqueId;
        const mockBuildUniqueId = jest.fn();
        // @ts-expect-error: protected
        let originalValidateIndexedInformations = ChorusParser.isIndexedInformationsValid;
        const mockValidateIndexedInformations = jest.fn().mockReturnValue(true);

        const ROWS = [...PAGES];

        beforeAll(() => {
            mockedParserHelper.linkHeaderToData.mockReturnValue(ENTITIES[0].data);
            // @ts-expect-error: mock
            mockedParserHelper.indexDataByPathObject.mockReturnValue(ENTITIES[0].indexedInformations);
            // @ts-expect-error: protected
            ChorusParser.buildUniqueId = mockBuildUniqueId;
            // @ts-expect-error: protected
            ChorusParser.isIndexedInformationsValid = mockValidateIndexedInformations;
        });

        afterAll(() => {
            // @ts-expect-error: protected
            ChorusParser.buildUniqueId = originalBuildUniqueId;
            // @ts-expect-error: protected
            ChorusParser.isIndexedInformationsValid = originalValidateIndexedInformations;
        });

        it.each`
            fn
            ${mockedParserHelper.linkHeaderToData}
            ${mockedParserHelper.indexDataByPathObject}
            ${mockValidateIndexedInformations}
            ${mockBuildUniqueId}
        `("should call $fn", ({ fn }) => {
            // @ts-expect-error: protected
            ChorusParser.rowsToEntities([], ROWS);
            expect(fn).toHaveBeenCalledTimes(ROWS.length);
        });

        it("should not return invalid entities", () => {
            mockValidateIndexedInformations.mockReturnValueOnce(false);
            const expected = ROWS.length - 1;
            // @ts-expect-error: protected
            const actual = ChorusParser.rowsToEntities([], ROWS).length;
            expect(actual).toEqual(expected);
        });
    });

    describe("isIndexedInformationsValid", () => {
        // @ts-expect-error: protected
        let originalvalidateIndexedInformationsNEW = ChorusParser.validateIndexedInformations;
        const mockedvalidateIndexedInformationsNEW = jest.fn().mockReturnValue(true);

        beforeAll(() => {
            // @ts-expect-error: protected
            ChorusParser.validateIndexedInformations = mockedvalidateIndexedInformationsNEW;
        });

        afterAll(() => {
            // @ts-expect-error: protected
            ChorusParser.validateIndexedInformations = originalvalidateIndexedInformationsNEW;
        });

        it("should return true", () => {
            const expected = true;
            //@ts-expect-error: protected
            const actual = ChorusParser.isIndexedInformationsValid(ENTITIES[0]);
            expect(actual).toEqual(expected);
        });

        it("should return false", () => {
            mockedvalidateIndexedInformationsNEW.mockReturnValueOnce(false);
            const expected = false;
            //@ts-expect-error: protected
            const actual = ChorusParser.isIndexedInformationsValid(ENTITIES[0]);
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
