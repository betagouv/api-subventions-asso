import { getMonthFromFrenchStr, isValidDate } from "./DateHelper";

describe("DateHelper", () => {
    describe("getMonthFromFrenchStr", () => {
        it("return english month", () => {
            const expected = "january";
            const actual = getMonthFromFrenchStr("JANVIER");
            expect(actual).toEqual(expected);
        })
    })

    describe("isValidDate", () => {
        it("should return true", () => {
            const expected = true;
            const actual = isValidDate(new Date());
            expect(actual).toEqual(expected);
        })

        it("should return false if undefined", () => {
            const expected = false;
            const actual = isValidDate(undefined);
            expect(actual).toEqual(expected);
        });

        it("should return false if wrong date string", () => {
            const expected = false;
            const actual = isValidDate("not a date");
            expect(actual).toEqual(expected);
        });
    })
})