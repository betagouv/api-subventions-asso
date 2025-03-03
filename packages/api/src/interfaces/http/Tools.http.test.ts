import { ToolsHttp } from "./Tools.http";
import csvSyncStringifier = require("csv-stringify/sync");
import { ParsedDataWithProblem } from "../../modules/providers/scdl/@types/Validation";
import scdlService from "../../modules/providers/scdl/scdl.service";

jest.mock("../../modules/providers/scdl/scdl.service");
jest.mock("csv-stringify/sync");

describe("Tools test", () => {
    const FILE_CONTENT = Buffer.from("content");
    const FILE = { buffer: FILE_CONTENT } as unknown as Express.Multer.File;
    const PAGE_NAME = "subvs";
    const ROW_OFFSET = 42;
    const DELIMITER = ",";
    const QUOTE = "'";
    const ERRORS = [{ a: 1, b: 2, c: 3, d: 4 }] as unknown as ParsedDataWithProblem[];
    const CSV_ERRORS = "a;b;c;d\n1;2;3;4";
    let ctrl = new ToolsHttp();
    beforeAll(() => {
        jest.mocked(scdlService.parseXls).mockReturnValue({ errors: ERRORS, entities: [] });
        jest.mocked(scdlService.parseCsv).mockReturnValue({ errors: ERRORS, entities: [] });
        jest.mocked(csvSyncStringifier.stringify).mockReturnValue(CSV_ERRORS);
    });

    describe("parseXls", () => {
        it("calls parser with proper args", () => {
            // @ts-expect-error -- spy private
            ctrl.parseXls(FILE, PAGE_NAME, ROW_OFFSET);
            expect(scdlService.parseXls).toHaveBeenCalledWith(FILE_CONTENT, PAGE_NAME, ROW_OFFSET);
        });

        it("parses string row offset", () => {
            // @ts-expect-error -- spy private
            ctrl.parseXls(FILE, PAGE_NAME, "42");
            expect(scdlService.parseXls).toHaveBeenCalledWith(FILE_CONTENT, PAGE_NAME, ROW_OFFSET);
        });

        it("stringifies errors from parser", () => {
            // @ts-expect-error -- spy private
            ctrl.parseXls(FILE, PAGE_NAME, ROW_OFFSET);
            expect(csvSyncStringifier.stringify).toHaveBeenCalledWith(ERRORS, { header: true });
        });

        it("returns stringified errors", () => {
            const expected = CSV_ERRORS;
            // @ts-expect-error -- spy private
            const actual = ctrl.parseXls(FILE, PAGE_NAME, ROW_OFFSET);
            expect(actual).toBe(expected);
        });
    });

    describe("parseCsv", () => {
        it("calls parser with proper args", () => {
            // @ts-expect-error -- spy private
            ctrl.parseCsv(FILE, DELIMITER, QUOTE);
            expect(scdlService.parseCsv).toHaveBeenCalledWith(FILE_CONTENT, DELIMITER, QUOTE);
        });

        it("converts 'false' value to boolean if given as quote", () => {
            // @ts-expect-error -- spy private
            ctrl.parseCsv(FILE, DELIMITER, "false");
            expect(scdlService.parseCsv).toHaveBeenCalledWith(FILE_CONTENT, DELIMITER, false);
        });

        it("stringifies errors from parser", () => {
            // @ts-expect-error -- spy private
            ctrl.parseCsv(FILE, DELIMITER, QUOTE);
            expect(csvSyncStringifier.stringify).toHaveBeenCalledWith(ERRORS, { header: true });
        });

        it("returns stringified errors", () => {
            const expected = CSV_ERRORS;
            // @ts-expect-error -- spy private
            const actual = ctrl.parseCsv(FILE, DELIMITER, QUOTE);
            expect(actual).toBe(expected);
        });
    });

    describe("parse", () => {
        let spyXls: jest.SpyInstance;
        const xlsMock = jest.fn();
        let spyCsv: jest.SpyInstance;
        const csvMock = jest.fn();

        beforeAll(() => {
            // @ts-expect-error -- spy private
            spyCsv = jest.spyOn(ctrl, "parseCsv").mockImplementation(csvMock);
            // @ts-expect-error -- spy private
            spyXls = jest.spyOn(ctrl, "parseXls").mockImplementation(xlsMock);
        });

        afterAll(() => {
            spyXls.mockRestore();
            spyCsv.mockRestore();
        });

        it.each`
            type       | methodName    | args                       | spy
            ${"csv"}   | ${"parseCsv"} | ${[DELIMITER, QUOTE]}      | ${csvMock}
            ${"excel"} | ${"parseXls"} | ${[PAGE_NAME, ROW_OFFSET]} | ${xlsMock}
        `("call $methodName with proper args if type is $type", ({ type, args, spy }) => {
            ctrl.parse(FILE, type, PAGE_NAME, ROW_OFFSET, DELIMITER, QUOTE);
            expect(spy).toHaveBeenCalledWith(FILE, ...args);
        });

        it("throws BadRequest if neither excel nor csv type", () => {});
    });
});
