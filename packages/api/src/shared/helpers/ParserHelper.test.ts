import * as ParserHelper from "./ParserHelper";

describe("ParserHelper", () => {
    describe("ExcelDateToJSDate()", () => {
        it("should return a valid date", () => {
            const expected = new Date("2018-12-31T00:00:00.000Z");
            const actual = ParserHelper.ExcelDateToJSDate(43465);
            expect(actual).toEqual(expected)
        })
    })
})