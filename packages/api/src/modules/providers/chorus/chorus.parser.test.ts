import ChorusParser from "./chorus.parser";
import {
    FILLED_HEADERS,
    HEADERS,
    PAGES,
    EUROPEAN_PAGE,
    PARSED_DATA,
    CHORUS_ENTITIES,
} from "./__fixtures__/ChorusFixtures";
import * as StringHelper from "../../../shared/helpers/StringHelper";
import { GenericParser } from "../../../shared/GenericParser";

jest.mock("../../../shared/GenericParser");
const mockedGenericParser = jest.mocked(GenericParser);
jest.mock("../../../shared/helpers/CliHelper");
jest.mock("./entities/ChorusEntity");
jest.mock("../../../shared/helpers/StringHelper");
const mockedStringHelper = jest.mocked(StringHelper);

describe("ChorusParser", () => {
    const NATIONAL_DATA = [HEADERS, ...PAGES];
    const EUROPEAN_DATA = [HEADERS, ...EUROPEAN_PAGE];
    const NATIONAL_HEADERS_AND_ROWS = {
        headers: FILLED_HEADERS,
        rows: NATIONAL_DATA.slice(1),
    };
    describe("buildUniqueId", () => {
        it("call getMD5", () => {
            const entity = CHORUS_ENTITIES[0];
            // @ts-expect-error: protected
            ChorusParser.buildUniqueId(entity);
            expect(mockedStringHelper.getMD5).toHaveBeenCalledWith(
                `${entity.ej}-${entity.numPosteEJ}-${entity.numeroDemandePaiement}-${entity.numPosteDP}-${entity.codeSociete}-${entity.exercice}`,
            );
        });
    });

    describe("buildEntityFromDto", () => {
        it("returns partial entity (without uniqueId)", () => {
            // @ts-expect-error: test private method
            const actual = ChorusParser.buildEntityFromDto(PARSED_DATA[0]);
            expect(actual).toMatchSnapshot({ updateDate: expect.any(Date) });
        });
    });

    describe("hasMandatoryFields", () => {
        it("should return true", () => {
            const expected = true;
            // @ts-expect-error: access protected method
            const actual = ChorusParser.hasMandatoryFields(CHORUS_ENTITIES[0]);
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
            const WRONG_INDEXED_INFORMATIONS = { ...CHORUS_ENTITIES[0], [missingProp]: undefined };
            const expected = false;
            // @ts-expect-error: access protected method
            const actual = ChorusParser.hasMandatoryFields(WRONG_INDEXED_INFORMATIONS);
            expect(actual).toEqual(expected);
        });
    });

    describe("validateEntity", () => {
        const mockHasUniqueKeyFields: jest.SpyInstance = jest
            // @ts-expect-error: ok
            .spyOn(ChorusParser, "hasMandatoryFields");

        beforeEach(() => {
            mockHasUniqueKeyFields.mockReturnValue(true);
        });

        it("rejects because codeBranche is not accepted", () => {
            const entity = { ...CHORUS_ENTITIES[0], codeBranche: "WRONG CODE" };

            //@ts-expect-error: protected
            expect(() => ChorusParser.validateEntity(entity)).toThrow(
                `The branch ${entity.codeBranche} is not accepted`,
            );
        });

        // missingProps order matters for the expect on error message to pass
        it("rejects because $missingProps unique key field(s) is/are missing", () => {
            mockHasUniqueKeyFields.mockReturnValue(false);
            const entity = CHORUS_ENTITIES[0];

            //@ts-expect-error: protected
            expect(() => ChorusParser.validateEntity(entity)).toThrow("The entity is missing mandatory fields");
        });

        it("rejects because amount is not a number", () => {
            const entity = { ...CHORUS_ENTITIES[0], amount: undefined };
            //@ts-expect-error: protected
            expect(() => ChorusParser.validateEntity(entity)).toThrow(`Invalid amount`);
        });

        it("rejects dateOperation is not a Date", () => {
            const entity = { ...CHORUS_ENTITIES[0], dateOperation: "01/01/1960" };
            //@ts-expect-error: protected
            expect(() => ChorusParser.validateEntity(entity)).toThrow(`Invalid operation date`);
        });

        it("rejects because siret is not valid", () => {
            const siret = "SIRET";
            const entity = { ...CHORUS_ENTITIES[0], siret };
            //@ts-expect-error: protected
            expect(() => ChorusParser.validateEntity(entity)).toThrow(`Invalid SIRET: ${siret}`);
        });

        it("should return true if siret equals #", () => {
            const entity = { ...CHORUS_ENTITIES[0], siret: "#" };
            //@ts-expect-error: protected
            expect(ChorusParser.validateEntity(entity)).toEqual(true);
        });

        it("rejects because ej is not valid", () => {
            const ej = "00000";
            const entity = { ...CHORUS_ENTITIES[0], ej };
            //@ts-expect-error: protected
            expect(() => ChorusParser.validateEntity(entity)).toThrow(`Invalid EJ: ${ej}`);
        });

        it("accepts", () => {
            const entity = CHORUS_ENTITIES[0];
            //@ts-expect-error: protected
            expect(ChorusParser.validateEntity(entity)).toEqual(true);
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
        const originalValidateEntity = ChorusParser.validateEntity;
        const mockValidateEntity = jest.fn().mockReturnValue(true);

        const ROWS = [...PAGES];

        beforeEach(() => {
            mockedGenericParser.linkHeaderToData.mockReturnValue(PARSED_DATA[0]);
            // @ts-expect-error: protected
            ChorusParser.validateEntity = mockValidateEntity;
        });

        afterAll(() => {
            // @ts-expect-error: protected
            ChorusParser.validateEntity = originalValidateEntity;
        });

        it.each`
            fn
            ${mockedGenericParser.linkHeaderToData}
            ${mockValidateEntity}
        `("should call $fn", ({ fn }) => {
            // @ts-expect-error: protected
            ChorusParser.nationalDataToEntities({ headers: FILLED_HEADERS, rows: ROWS });
            expect(fn).toHaveBeenCalledTimes(ROWS.length);
        });

        it("should not return invalid entities", async () => {
            const mockWithThrow = jest
                .fn()
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(true)
                .mockImplementationOnce(() => {
                    throw "invalid";
                });
            // @ts-expect-error: mock private method
            ChorusParser.validateEntity = mockWithThrow;
            const expected = ROWS.length - 1;
            // @ts-expect-error: protected
            const actual = ChorusParser.nationalDataToEntities({ headers: FILLED_HEADERS, rows: ROWS }).length;
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
            mockedNationalDataToEntities.mockReturnValue(CHORUS_ENTITIES);
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
