import { getMonthFromFrenchStr } from "./DateHelper";

describe("DateHelper", () => {
    describe("getMonthFromFrenchStr", () => {
        it("return english month", () => {
            const expected = "january";
            const actual = getMonthFromFrenchStr("JANVIER");
            expect(actual).toEqual(expected);
        })
    })
})