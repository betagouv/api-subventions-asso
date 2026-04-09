import Parser from "./abstract-parser";
import * as XLSX from "xlsx";

jest.mock("fs");
jest.mock("xlsx");

describe("Parser", () => {
    class TestParser extends Parser {}

    const FILE_PATH = "/path/to/file";
    const DATA = [{ foo: "bar" }];
    const WORKBOOK = {
        SheetNames: ["Sheet1"],
        Sheets: {
            Sheet1: { A1: { v: "foo" }, B1: { v: "bar" } },
        },
    };

    describe("read", () => {
        beforeAll(() => {
            jest.spyOn(XLSX, "readFile").mockReturnValue(WORKBOOK);
            jest.spyOn(XLSX.utils, "sheet_to_json").mockReturnValue(DATA);
        });

        it("read file", () => {
            TestParser.read(FILE_PATH);
            expect(XLSX.readFile).toHaveBeenCalledWith(FILE_PATH);
        });

        it("extract first sheet", () => {
            TestParser.read(FILE_PATH);
            expect(XLSX.utils.sheet_to_json).toHaveBeenCalledWith(WORKBOOK.Sheets["Sheet1"]);
        });

        it("return data", () => {
            const expected = DATA;
            const actual = TestParser.read(FILE_PATH);
            expect(actual).toEqual(expected);
        });
    });
});
