import { computeMonthBetweenDates, getMonthFromFrenchStr, isValidDate } from "./DateHelper";

describe("DateHelper", () => {
    describe("getMonthFromFrenchStr", () => {
        it("return english month", () => {
            const expected = "january";
            const actual = getMonthFromFrenchStr("JANVIER");
            expect(actual).toEqual(expected);
        });
    });

    describe("isValidDate", () => {
        it("should return true", () => {
            const expected = true;
            const actual = isValidDate(new Date());
            expect(actual).toEqual(expected);
        });

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
    });

    describe("computeMonthBetweenDates", () => {
        it("should return 9 (Same year)", () => {
            const expected = 9;
            const actual = computeMonthBetweenDates(new Date(2023, 0, 0), new Date(2023, 9, 0)); // Between January and End of September

            expect(expected).toBe(actual);
        });

        it("should return 9", () => {
            const expected = 9;
            const actual = computeMonthBetweenDates(new Date(2022, 10, 0), new Date(2023, 7, 0));

            expect(expected).toBe(actual);
        });

        it("should return 9, inversed date", () => {
            const expected = 9;
            const actual = computeMonthBetweenDates(new Date(2023, 7, 0), new Date(2022, 10, 0));

            expect(expected).toBe(actual);
        });

        it("should return 21 with one year between two date", () => {
            const expected = 21;
            const actual = computeMonthBetweenDates(new Date(2021, 10, 0), new Date(2023, 7, 0));

            expect(expected).toBe(actual);
        });

        it("should return 21, inversed date with one year between two date", () => {
            const expected = 21;
            const actual = computeMonthBetweenDates(new Date(2023, 7, 0), new Date(2021, 10, 0));

            expect(expected).toBe(actual);
        });
    });
});
