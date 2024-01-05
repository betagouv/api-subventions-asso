import * as CsvHelper from "./csvHelper";

describe("csvHelper", () => {
    const CSV_ROW_HEADER = ["Name", "Date", "Adresse"];
    const CSV_ROW_ARRAY = ["foo", "bar", "baz"];

    describe("buildCsv", () => {
        it("should return a csv string", () => {
            const expected = "Name;Date;Adresse\nfoo;bar;baz\nfoo;bar;baz\nfoo;bar;baz\n";
            const actual = CsvHelper.buildCsv(CSV_ROW_HEADER, [CSV_ROW_ARRAY, CSV_ROW_ARRAY, CSV_ROW_ARRAY]);
            expect(actual).toEqual(expected);
        });
    });
});
