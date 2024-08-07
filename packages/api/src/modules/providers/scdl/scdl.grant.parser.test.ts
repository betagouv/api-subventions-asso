import ScdlGrantParser from "./scdl.grant.parser";
import MiscScdlGrant from "./__fixtures__/MiscScdlGrant";
import * as Validators from "../../../shared/Validators";
import csvSyncParser = require("csv-parse/sync");

jest.mock("../../../shared/Validators");
const mockedValidators = jest.mocked(Validators);
import * as DateHelper from "../../../shared/helpers/DateHelper";

jest.mock("../../../shared/helpers/DateHelper");
const mockedDateHelper = jest.mocked(DateHelper);
import * as ParserHelper from "../../../shared/helpers/ParserHelper";
import { SCDL_STORABLE } from "./__fixtures__/RawData";
import Siret from "../../../valueObjects/Siret";
import Rna from "../../../valueObjects/Rna";

jest.mock("../../../shared/helpers/ParserHelper");
const mockedParserHelper = jest.mocked(ParserHelper);
jest.mock("csv-parse/sync");
const mockedCsvLib = jest.mocked(csvSyncParser);

describe("ScdlGrantParser", () => {
    const BUFFER = Buffer.alloc(1);
    let isSiretSpy: jest.SpyInstance;
    let isRnaSpy: jest.SpyInstance = jest.spyOn(Rna, "isRna");

    beforeAll(() => {
        isSiretSpy = jest.spyOn(Siret, "isSiret");
    });

    describe("parseCsv", () => {
        let validateSpy: jest.SpyInstance;

        beforeEach(() => {
            mockedCsvLib.parse.mockReturnValue(SCDL_STORABLE);
            validateSpy = jest.spyOn(ScdlGrantParser, "_filterValidEntities").mockImplementation();
        });

        afterAll(() => validateSpy.mockRestore());

        it("should call csv lib parse", () => {
            ScdlGrantParser.parseCsv(BUFFER);
            expect(mockedCsvLib.parse).toHaveBeenCalledWith(BUFFER, {
                columns: true,
                delimiter: ";",
                skip_empty_lines: true,
                trim: true,
            });
        });

        it("calls validation with parsed data", () => {
            ScdlGrantParser.parseCsv(BUFFER);
            expect(validateSpy).toHaveBeenCalledWith(SCDL_STORABLE);
        });
    });

    describe("parseExcel", () => {
        const HEADERS = ["a", "b", "c"];
        const DATA = [
            [1, 2, 3],
            [4, 5, 6],
        ];
        const SHEET = [HEADERS, ...DATA];
        let validateSpy: jest.SpyInstance;

        beforeAll(() => {
            jest.mocked(ParserHelper.xlsParseWithPageName).mockReturnValue([{ data: SHEET, name: "whateverName" }]);
            validateSpy = jest.spyOn(ScdlGrantParser, "_filterValidEntities").mockImplementation();
        });

        afterAll(() => {
            jest.mocked(ParserHelper.xlsParseWithPageName).mockRestore();
            validateSpy.mockRestore();
        });

        it("parses excel with page names", () => {
            ScdlGrantParser.parseExcel(BUFFER);
            expect(ParserHelper.xlsParseWithPageName).toHaveBeenCalledWith(BUFFER);
        });

        it("throws if empty page", () => {
            jest.mocked(ParserHelper.xlsParseWithPageName).mockReturnValueOnce([{ data: [], name: "first" }]);
            expect(() => ScdlGrantParser.parseExcel(BUFFER)).toThrowErrorMatchingInlineSnapshot(
                `"no data in required page (default is first page)"`,
            );
        });

        it("reads proper page", () => {
            jest.mocked(ParserHelper.xlsParseWithPageName).mockReturnValueOnce([
                { data: [], name: "first" },
                {
                    data: SHEET,
                    name: "specificName",
                },
            ]);
            ScdlGrantParser.parseExcel(BUFFER, "specificName");
            expect(ParserHelper.linkHeaderToData).toHaveBeenCalled();
        });

        it("reads default page: first page", () => {
            ScdlGrantParser.parseExcel(BUFFER);
            expect(ParserHelper.linkHeaderToData).toHaveBeenCalled();
        });

        it("applies offset", () => {
            jest.mocked(ParserHelper.xlsParseWithPageName).mockReturnValueOnce([
                {
                    data: [[], [], ...SHEET],
                    name: "whateverName",
                },
            ]);
            ScdlGrantParser.parseExcel(BUFFER, undefined, 2);
            expect(ParserHelper.linkHeaderToData).toHaveBeenCalledWith(HEADERS, DATA[0]);
            expect(ParserHelper.linkHeaderToData).toHaveBeenCalledWith(HEADERS, DATA[1]);
        });

        it("filters valid grants", () => {
            const spyFilter = jest.spyOn(ScdlGrantParser, "_filterValidEntities");
            jest.mocked(ParserHelper.linkHeaderToData).mockReturnValue("TOTO" as unknown as Record<string, any>);
            ScdlGrantParser.parseExcel(BUFFER);
            expect(spyFilter).toHaveBeenCalledWith(["TOTO", "TOTO"]);
            jest.mocked(ParserHelper.linkHeaderToData).mockRestore();
        });
    });

    describe("isGrantValid", () => {
        const GRANT = { ...MiscScdlGrant };

        beforeEach(() => {
            mockedDateHelper.isValidDate.mockReturnValue(true);
            mockedValidators.isNumberValid.mockReturnValue(true);
        });

        it("should return true with a well formatted grant", () => {
            const expected = true;
            // @ts-expect-error: protected method
            const actual = ScdlGrantParser.isGrantValid(GRANT);
            expect(actual).toEqual(expected);
        });

        it("should return false if siret not valid", () => {
            isSiretSpy.mockReturnValueOnce(false);
            const expected = false;
            // @ts-expect-error: protected method
            const actual = ScdlGrantParser.isGrantValid(GRANT);
            expect(actual).toEqual(expected);
        });

        it("should return false if exercise is defined but not valid", () => {
            mockedValidators.isNumberValid.mockReturnValueOnce(false);
            const expected = false;
            // @ts-expect-error: protected method
            const actual = ScdlGrantParser.isGrantValid(GRANT);
            expect(actual).toEqual(expected);
        });

        it("should return false if paymentStartDate is not valid ", () => {
            mockedDateHelper.isValidDate.mockReturnValueOnce(false);
            const expected = false;
            // @ts-expect-error: protected method
            const actual = ScdlGrantParser.isGrantValid(GRANT);
            expect(actual).toEqual(expected);
        });

        it.each`
            param               | mockValidator                   | nbFalseMock
            ${"conventionDate"} | ${mockedDateHelper.isValidDate} | ${1}
            ${"associationRna"} | ${isRnaSpy}                     | ${1}
            ${"paymentEndDate"} | ${mockedDateHelper.isValidDate} | ${2}
        `("it sets '$param' to undefined if set but invalid", ({ param, mockValidator, nbFalseMock }) => {
            // mock validators to get to the optionnal part of isGrantValid()
            isSiretSpy.mockReturnValueOnce(true);
            mockedDateHelper.isValidDate.mockReturnValueOnce(true);
            mockedValidators.isNumberValid.mockReturnValueOnce(true);
            mockedValidators.isNumberValid.mockReturnValueOnce(true);

            for (let i = 0; i < nbFalseMock; i++) mockValidator.mockReturnValueOnce(false);

            const expected = { [param]: undefined };
            const actual = { ...GRANT };
            // @ts-expect-error: protected method
            ScdlGrantParser.isGrantValid(actual);
            expect(actual).toMatchObject(expected);
        });
    });

    describe("_filterValidEntities", () => {
        let isValidSpy: jest.SpyInstance;

        beforeEach(() => {
            // @ts-expect-error -- protected method
            isValidSpy = jest.spyOn(ScdlGrantParser, "isGrantValid").mockReturnValue(true);
            mockedParserHelper.indexDataByPathObject.mockImplementation((_mapper, row) => row);
        });

        afterEach(() => {
            isValidSpy.mockRestore();
        });

        it("should return storableChunk", () => {
            const actual = ScdlGrantParser._filterValidEntities(SCDL_STORABLE);
            expect(actual).toMatchSnapshot();
        });

        it("returns only valid entities", () => {
            isValidSpy.mockReturnValueOnce(false);
            const expected = SCDL_STORABLE.length - 1;
            const actual = ScdlGrantParser._filterValidEntities(SCDL_STORABLE).length;
            expect(actual).toBe(expected);
        });
    });
});
