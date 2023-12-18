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
jest.mock("../../../shared/helpers/ParserHelper");
const mockedParserHelper = jest.mocked(ParserHelper);
jest.mock("csv-parse/sync");
const mockedCsvLib = jest.mocked(csvSyncParser);

describe("ScdlGrantParser", () => {
    describe("parseCsv", () => {
        const BUFFER = Buffer.alloc(1);
        const mockIsGrantValid = jest.fn();
        // @ts-expect-error: protected
        const originalIsGrantValid = ScdlGrantParser.isGrantValid;

        beforeEach(() => {
            mockedCsvLib.parse.mockReturnValue(SCDL_STORABLE);
            // @ts-expect-error: mock protected static method
            ScdlGrantParser.isGrantValid = mockIsGrantValid.mockReturnValue(true);
        });

        // @ts-expect-error: unmock protected static method
        afterAll(() => (ScdlGrantParser.isGrantValid = originalIsGrantValid));

        it("should call csv lib parse", () => {
            ScdlGrantParser.parseCsv(BUFFER);
            expect(mockedCsvLib.parse).toHaveBeenCalledWith(BUFFER, {
                columns: true,
                delimiter: ";",
                skip_empty_lines: true,
                trim: true,
            });
        });

        it("should return storableChunk", () => {
            // @ts-expect-error: mock
            mockedParserHelper.indexDataByPathObject.mockImplementation((mapper, row) => row);
            const actual = ScdlGrantParser.parseCsv(BUFFER);
            expect(actual).toMatchSnapshot();
        });
    });

    describe("isGrantValid", () => {
        const GRANT = { ...MiscScdlGrant };

        beforeEach(() => {
            mockedValidators.isSiret.mockReturnValue(true);
            mockedDateHelper.isValidDate.mockReturnValue(true);
        });

        it("should return false if siret not valid", () => {
            mockedValidators.isSiret.mockReturnValueOnce(false);
            const expected = false;
            // @ts-expect-error: protected method
            const actual = ScdlGrantParser.isGrantValid(GRANT);
            expect(actual).toEqual(expected);
        });

        it("should return false if convention date not valid", () => {
            mockedDateHelper.isValidDate.mockReturnValueOnce(false);
            const expected = false;
            // @ts-expect-error: protected method
            const actual = ScdlGrantParser.isGrantValid(GRANT);
            expect(actual).toEqual(expected);
        });
    });
});
