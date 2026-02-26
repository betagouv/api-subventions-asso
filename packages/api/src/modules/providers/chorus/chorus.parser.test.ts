import ChorusParser from "./chorus.parser";
import { ENTITIES, FILLED_HEADERS, HEADERS, PAGES, EUROPEAN_PAGE } from "./__fixtures__/ChorusFixtures";
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
    const NATIONAL_DATA = [HEADERS, ...PAGES];
    const EUROPEAN_DATA = [HEADERS, ...EUROPEAN_PAGE];
    const NATIONAL_HEADERS_AND_ROWS = {
        headers: FILLED_HEADERS,
        rows: NATIONAL_DATA.slice(2),
    };
    describe("buildUniqueId", () => {
        it("call getMD5", () => {
            const info = ENTITIES[0].indexedInformations;
            // @ts-expect-error: protected
            ChorusParser.buildUniqueId(info);
            expect(mockedStringHelper.getMD5).toHaveBeenCalledWith(
                `${info.ej}-${info.numPosteEJ}-${info.numeroDemandePaiement}-${info.numPosteDP}-${info.codeSociete}-${info.exercice}`,
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

    describe("nationalDataToEntities", () => {
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
            ChorusParser.nationalDataToEntities({ headers: FILLED_HEADERS, rows: ROWS });
            expect(fn).toHaveBeenCalledTimes(ROWS.length);
        });

        it("should not return invalid entities", () => {
            mockValidateIndexedInformations.mockReturnValueOnce(false);
            const expected = ROWS.length - 1;
            // @ts-expect-error: protected
            const actual = ChorusParser.nationalDataToEntities({ headers: FILLED_HEADERS, rows: ROWS }).length;
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

    describe("getHeadersAndRows", () => {
        const mockRenameEmptyHeaders: jest.Mock = jest.fn(() => FILLED_HEADERS);
        beforeAll(() => {
            // @ts-expect-error: mock private static method
            ChorusParser.renameEmptyHeaders = mockRenameEmptyHeaders;
        });

        it("renames empty headers", () => {
            // @ts-expect-error: test private static method
            ChorusParser.getHeadersAndRows(NATIONAL_DATA);
            expect(mockRenameEmptyHeaders).toHaveBeenCalledWith(NATIONAL_DATA[0]);
        });

        it("returns headers and rows", () => {
            const expected = NATIONAL_HEADERS_AND_ROWS;
            // @ts-expect-error: test private static method
            const actual = ChorusParser.getHeadersAndRows(NATIONAL_DATA);
            expect(actual).toEqual(expected);
        });
    });

    describe("parse()", () => {
        const mockGetHeadersAndRows = jest.fn();
        const mockedNationalDataToEntities = jest.fn();
        const mockedEuropeanDataToEntities = jest.fn();

        const FILE_CONTENT = "THIS IS A BUFFER";

        const EUROPEAN_HEADERS_AND_ROWS = { headers: EUROPEAN_DATA[0], rows: EUROPEAN_DATA.slice(2) };

        beforeAll(() => {
            mockedGenericParser.xlsxParse.mockReturnValue([
                { data: [[], []], name: "TAB" },
                { data: NATIONAL_DATA, name: "1. Extraction" },
                { data: EUROPEAN_DATA, name: "2. Extraction FEHBE" },
            ]);
            // @ts-expect-error: protected
            ChorusParser.getHeadersAndRows = mockGetHeadersAndRows;

            // @ts-expect-error: protected
            ChorusParser.nationalDataToEntities = mockedNationalDataToEntities;
            mockedNationalDataToEntities.mockReturnValue(ENTITIES);
            // @ts-expect-error: protected
            ChorusParser.europeanDataToEntities = mockedEuropeanDataToEntities;
            mockedEuropeanDataToEntities.mockReturnValue([]);
        });

        beforeEach(() => {
            mockGetHeadersAndRows.mockReturnValueOnce(NATIONAL_HEADERS_AND_ROWS);
            mockGetHeadersAndRows.mockReturnValueOnce(EUROPEAN_HEADERS_AND_ROWS);
        });

        // we used to have a xlsx with only one tab called "1. Extraction"
        // the current format has 3 tabs and the second one is "1. Extraction"
        it("should work with old format", () => {
            // @ts-expect-error: mock
            ChorusParser.parse(FILE_CONTENT, () => true);
            expect(mockedGenericParser.xlsxParse).toHaveBeenCalledWith(FILE_CONTENT);
            mockedGenericParser.xlsxParse.mockReturnValueOnce([
                { data: NATIONAL_DATA, name: "1. Extraction" },
                { name: "2. Extraction FEHBE", data: NATIONAL_DATA },
            ]);
        });

        it("should call GenericParser.xlsxParse", () => {
            // @ts-expect-error: mock
            ChorusParser.parse(FILE_CONTENT, () => true);
            expect(mockedGenericParser.xlsxParse).toHaveBeenCalledWith(FILE_CONTENT);
        });

        it("should get headers and rows from data", () => {
            // @ts-expect-error: mock
            ChorusParser.parse(FILE_CONTENT, () => true);
            expect(mockGetHeadersAndRows).toHaveBeenNthCalledWith(1, NATIONAL_DATA);
            expect(mockGetHeadersAndRows).toHaveBeenNthCalledWith(2, EUROPEAN_DATA);
        });

        it("should transform chorus national rows to entities", () => {
            // @ts-expect-error: mock
            ChorusParser.parse(FILE_CONTENT, () => true);
            expect(mockedNationalDataToEntities).toHaveBeenCalledWith(NATIONAL_HEADERS_AND_ROWS);
        });
        it("should transform chorus european rows to entities", () => {
            // @ts-expect-error: mock
            ChorusParser.parse(FILE_CONTENT, () => true);
            expect(mockedEuropeanDataToEntities).toHaveBeenCalledWith(EUROPEAN_HEADERS_AND_ROWS);
        });
    });
});
