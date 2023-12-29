import * as CsvHelper from "./csvHelper";

describe("csvHelper", () => {
    const CSV_ROW_HEADER = ["Name", "Date", "Adresse"];
    const CSV_ROW_ARRAY = ["foo", "bar", "baz"];
    describe("csvToString()", () => {
        it("should join array with \\n", () => {
            const expected = "foo\nbar\nbaz";
            const actual = CsvHelper.linesToCsv(CSV_ROW_ARRAY);
            expect(actual).toEqual(expected);
        });
    });

    describe("arrayToCsv()", () => {
        it("should join array with ;", () => {
            const expected = "foo;bar;baz";
            const actual = CsvHelper.arrayToLine(CSV_ROW_ARRAY);
            expect(actual).toEqual(expected);
        });
    });

    describe("buildCsv", () => {
        it("should return a csv string", () => {
            const expected = "Name;Date;Adresse\nfoo;bar;baz\nfoo;bar;baz\nfoo;bar;baz\n";
            const actual = CsvHelper.buildCsv(CSV_ROW_HEADER, [CSV_ROW_ARRAY, CSV_ROW_ARRAY, CSV_ROW_ARRAY]);
            expect(actual).toEqual(expected);
        });
    });
});
