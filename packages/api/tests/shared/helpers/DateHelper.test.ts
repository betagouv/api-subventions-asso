import * as DateHelper from "../../../src/shared/helpers/DateHelper"

describe("DateHelper", () => {
    describe("toWinstonTimestamp()", () => {
        it("return a formated ISO timestamp", () => {
            const timestamp = "2011-10-05T14:48:00.000Z"
            const expected = "2011-10-05 14:48:00.000Z"
            const actual = DateHelper.formatTimestamp(timestamp);
            expect(actual).toBe(expected);
        })
    })
    describe("getYMDFromISO()", () => {
        it("return YYYY-MM-DD format", () => {
            const expected = "2022-04-20";
            const timestamp = DateHelper.formatTimestamp(new Date(expected).toISOString());
            const actual = DateHelper.getYMDFromISO(timestamp);
            expect(actual).toEqual(expected);
        })
    })
})