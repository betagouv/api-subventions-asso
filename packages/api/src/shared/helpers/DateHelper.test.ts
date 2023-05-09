import * as DateHelper from "./DateHelper";

describe("DateHelper", () => {
    const TODAY = new Date();
    const YESTERDAY = new Date(new Date(TODAY).setDate(TODAY.getDate() - 1));
    const TOMORROW = new Date(new Date(TODAY).setDate(TODAY.getDate() + 1));
    const DATES = [TODAY, TOMORROW, YESTERDAY];
    describe("getMonthFromFrenchStr", () => {
        it("return english month", () => {
            const expected = "january";
            const actual = DateHelper.getMonthFromFrenchStr("JANVIER");
            expect(actual).toEqual(expected);
        });
    });

    describe("isValidDate", () => {
        it("should return true", () => {
            const expected = true;
            const actual = DateHelper.isValidDate(new Date());
            expect(actual).toEqual(expected);
        });

        it("should return false if undefined", () => {
            const expected = false;
            const actual = DateHelper.isValidDate(undefined);
            expect(actual).toEqual(expected);
        });

        it("should return false if wrong date string", () => {
            const expected = false;
            const actual = DateHelper.isValidDate("not a date");
            expect(actual).toEqual(expected);
        });
    });

    describe("computeMonthBetweenDates", () => {
        it("should return 9 (Same year)", () => {
            const expected = 9;
            const actual = DateHelper.computeMonthBetweenDates(new Date(2023, 0, 0), new Date(2023, 9, 0)); // Between January and End of September

            expect(expected).toBe(actual);
        });

        it("should return 9", () => {
            const expected = 9;
            const actual = DateHelper.computeMonthBetweenDates(new Date(2022, 10, 0), new Date(2023, 7, 0));

            expect(expected).toBe(actual);
        });

        it("should return 9, inversed date", () => {
            const expected = 9;
            const actual = DateHelper.computeMonthBetweenDates(new Date(2023, 7, 0), new Date(2022, 10, 0));

            expect(expected).toBe(actual);
        });

        it("should return 21 with one year between two date", () => {
            const expected = 21;
            const actual = DateHelper.computeMonthBetweenDates(new Date(2021, 10, 0), new Date(2023, 7, 0));

            expect(expected).toBe(actual);
        });

        it("should return 21, inversed date with one year between two date", () => {
            const expected = 21;
            const actual = DateHelper.computeMonthBetweenDates(new Date(2023, 7, 0), new Date(2021, 10, 0));

            expect(expected).toBe(actual);
        });
    });

    describe("sameDateNextYear", () => {
        it("returns proper date", () => {
            const input = new Date(2021, 6, 9);
            const expected = new Date(2022, 6, 9);
            const actual = DateHelper.sameDateNextYear(input);
            expect(actual).toEqual(expected);
        });
    });

    describe("sortDateAsc", () => {
        it("should return negative number", () => {
            const actual = DateHelper.sortDatesAsc(TODAY, TOMORROW);
            expect(actual).toBeLessThan(0);
        });

        it("should return positive number", () => {
            const actual = DateHelper.sortDatesAsc(TODAY, YESTERDAY);
            expect(actual).toBeGreaterThan(0);
        });
    });

    describe("getMostRecentDate", () => {
        it("should return most recent date", () => {
            const expected = TOMORROW;
            const actual = DateHelper.getMostRecentDate(DATES);
            expect(actual).toEqual(expected);
        });
    });

    describe("getMostOldestDate", () => {
        it("should return most recent date", () => {
            const expected = YESTERDAY;
            const actual = DateHelper.getMostOldestDate(DATES);
            expect(actual).toEqual(expected);
        });
    });
});
