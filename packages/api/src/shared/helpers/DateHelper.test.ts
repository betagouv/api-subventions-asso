import { getMonthFromFrenchStr, getMonthlyDataObject, isValidDate } from "./DateHelper";

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

    describe("getMonthlyDataObject", () => {
        const TEST_VALUE = 42;
        const INPUT_TEST = [{ month: 1, value: TEST_VALUE }];
        it("should have all months in keys", () => {
            const expectedKeys = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
            ];
            const actualKeys = Object.keys(getMonthlyDataObject(INPUT_TEST, "month", "value"));
            expect(actualKeys).toEqual(expectedKeys);
        });

        it("should associate correctly data from index to string", () => {
            const januaryValue = getMonthlyDataObject(INPUT_TEST, "month", "value")?.["January"];
            expect(januaryValue).toEqual(TEST_VALUE);
        });

        it("should fill in unknown data to 0", () => {
            const marchValue = getMonthlyDataObject(INPUT_TEST, "month", "value")?.["March"];
            expect(marchValue).toEqual(0);
        });
    });
});
