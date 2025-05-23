import ChorusParser from "./chorus.parser";
import { ENTITIES, FILLED_HEADERS, HEADERS, PAGES } from "./__fixtures__/ChorusFixtures";
import * as StringHelper from "../../../shared/helpers/StringHelper";
import { BeforeAdaptation, DefaultObject } from "../../../@types";
import { GenericParser } from "../../../shared/GenericParser";

jest.mock("../../../shared/GenericParser");
const mockedGenericParser = jest.mocked(GenericParser);
jest.mock("../../../shared/helpers/CliHelper");
jest.mock("./entities/ChorusLineEntity");
jest.mock("../../../shared/helpers/StringHelper");
const mockedStringHelper = jest.mocked(StringHelper);

describe("ChorusParser", () => {
    describe("buildUniqueId", () => {
        it("call getMD5", () => {
            const info = ENTITIES[0].indexedInformations;
            // @ts-expect-error: protected
            ChorusParser.buildUniqueId(info);
            expect(mockedStringHelper.getMD5).toHaveBeenCalledWith(
                `chorus-${info.ej}-${info.numPosteEJ}-${info.numeroDemandePaiement}-${info.numPosteDP}-${info.codeSociete}-${info.exercice}`,
            );
        });
    });

    describe("hasMandatoryFields", () => {
        it("should return true", () => {
            const expected = { value: true };
            // @ts-expect-error: access protected method
            const actual = ChorusParser.hasMandatoryFields(ENTITIES[0].indexedInformations);
            expect(actual).toEqual(expected);
        });

        it.each`
            missingProp
            ${"ej"}
            ${"numPosteEJ"}
            ${"numeroDemandePaiement"}
            ${"numPosteDP"}
            ${"exercice"}
            ${"codeSociete"}
        `("should return false", ({ missingProp }) => {
            const WRONG_INDEXED_INFORMATIONS = { ...ENTITIES[0].indexedInformations, [missingProp]: undefined };
            const expected = { value: false, hints: [missingProp] };
            // @ts-expect-error: access protected method
            const actual = ChorusParser.hasMandatoryFields(WRONG_INDEXED_INFORMATIONS);
            expect(actual).toEqual(expected);
        });

        it("should return multiple missing fields", () => {
            const WRONG_INDEXED_INFORMATIONS = {
                ...ENTITIES[0].indexedInformations,
                numeroDemandePaiement: undefined,
                exercice: undefined,
                codeSociete: undefined,
            };

            const expectedHints = ["numeroDemandePaiement", "exercice", "codeSociete"];

            // @ts-expect-error: access protected method
            const actual = ChorusParser.hasMandatoryFields(WRONG_INDEXED_INFORMATIONS);
            for (const hint of expectedHints) {
                expect(actual.hints).toContain(hint);
            }
        });
    });

    describe("validateIndexedInformations", () => {
        const mockHasUniqueKeyFields: jest.SpyInstance = jest
            // @ts-expect-error: ok
            .spyOn(ChorusParser, "hasMandatoryFields");

        beforeEach(() => {
            mockHasUniqueKeyFields.mockReturnValue({ value: true });
        });

        it("rejects because codeBranche is not accepted", () => {
            const indexedInformations = { ...ENTITIES[0].indexedInformations, codeBranche: "WRONG CODE" };

            //@ts-expect-error: protected
            expect(() => ChorusParser.validateIndexedInformations(indexedInformations)).toThrow(
                `The branch ${indexedInformations.codeBranche} is not accepted in data`,
            );
        });

        // missingProps order matters for the expect on error message to pass
        it.each`
            missingProps
            ${["ej"]}
            ${["ej", "numPosteDP", "codeSociete"]}
        `("rejects because $missingProps unique key field(s) is/are missing", ({ missingProps }) => {
            mockHasUniqueKeyFields.mockReturnValue({ value: false, hints: [missingProps] });
            const indexedInformations = ENTITIES[0].indexedInformations;

            //@ts-expect-error: protected
            expect(() => ChorusParser.validateIndexedInformations(indexedInformations)).toThrow(
                `The mandatory field(s) ${missingProps.concat(" - ")} are missing `,
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
        const originalBuildUniqueId = ChorusParser.buildUniqueId;
        const mockBuildUniqueId = jest.fn();
        // @ts-expect-error: protected
        const originalValidateIndexedInformations = ChorusParser.isIndexedInformationsValid;
        const mockValidateIndexedInformations = jest.fn().mockReturnValue(true);

        const ROWS = [...PAGES];

        beforeAll(() => {
            mockedGenericParser.linkHeaderToData.mockReturnValue(ENTITIES[0].data as DefaultObject<BeforeAdaptation>);
            jest.mocked(GenericParser.indexDataByPathObject).mockReturnValue(
                ENTITIES[0].indexedInformations as unknown as DefaultObject<unknown>,
            );
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
            ${mockedGenericParser.linkHeaderToData}
            ${GenericParser.indexDataByPathObject}
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
        const originalvalidateIndexedInformationsNEW = ChorusParser.validateIndexedInformations;
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

        const DATA = [HEADERS, ...PAGES];

        beforeAll(() => {
            mockedGenericParser.xlsParseWithPageName.mockReturnValue([
                { data: [[], []], name: "TAB" },
                { data: DATA, name: "1. Extraction" },
            ]);
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

        // we used to have a xlsx with only one tab called "1. Extraction"
        // the current format has 3 tabs and the second one is "1. Extraction"
        it("should work with old format", () => {
            const CONTENT = "THIS IS A BUFFER";
            // @ts-expect-error: mock
            ChorusParser.parse(CONTENT, () => true);
            expect(mockedGenericParser.xlsParseWithPageName).toHaveBeenCalledWith(CONTENT);
            mockedGenericParser.xlsParseWithPageName.mockReturnValueOnce([{ data: DATA, name: "1. Extraction" }]);
        });

        it("should call GenericParser.xlsParse", () => {
            const CONTENT = "THIS IS A BUFFER";
            // @ts-expect-error: mock
            ChorusParser.parse(CONTENT, () => true);
            expect(mockedGenericParser.xlsParseWithPageName).toHaveBeenCalledWith(CONTENT);
        });

        it("should rename empty headers", () => {
            const CONTENT = "THIS IS A BUFFER";
            // @ts-expect-error: mock
            ChorusParser.parse(CONTENT, () => true);
            expect(mockedRenameEmptyHeaders).toHaveBeenCalledWith(HEADERS);
        });

        it("should transform rows to entities", () => {
            const CONTENT = "THIS IS A BUFFER";
            // @ts-expect-error: mock
            ChorusParser.parse(CONTENT, () => true);
            expect(mockedRowsToEntities).toHaveBeenCalledWith(FILLED_HEADERS, DATA.slice(1));
        });
    });
});
