import * as ParserHelper from "./ParserHelper";
import dedent from "dedent";

describe("ParserHelper", () => {
    describe("ExcelDateToJSDate()", () => {
        it("should return a valid date", () => {
            const expected = new Date("2018-12-31T00:00:00.000Z");
            const actual = ParserHelper.ExcelDateToJSDate(43465);
            expect(actual).toEqual(expected);
        });
    });

    describe("sanitizeCellContent", () => {
        it("should test", () => {
            const expected =
                "start of line;I am a string and I need to be modified;end of line\nstart of second line;this is another line that needs to be modified;end of second line";
            const actual = ParserHelper.sanitizeCellContent(
                `start of line;"I am a string; and I need ; to be modified;";end of line\nstart of second line;"this is another ; line that needs ; to be modified ;";end of second line`,
                ";",
            );
            expect(actual).toEqual(expected);
        });
    });

    describe("parseCsv()", () => {
        const CSV = dedent`this is a string, with , (coma)
        this is a string, with ; (semi-colon)`;
        it("should apply default delimiter", () => {
            const actual = ParserHelper.csvParse(Buffer.from(CSV, "utf8"));
            expect(actual).toMatchSnapshot();
        });

        it("should apply custom delimiter", () => {
            const actual = ParserHelper.csvParse(Buffer.from(CSV, "utf8"), ";");
            expect(actual).toMatchSnapshot();
        });
    });
});
