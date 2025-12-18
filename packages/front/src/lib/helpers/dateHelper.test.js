import * as dateHelper from "./dateHelper";

describe("DateHelper", () => {
    describe("dateToDDMMYYYY()", () => {
        it("should return DD/MM/YYYY date", () => {
            const expected = "01/01/2023";
            const actual = dateHelper.dateToDDMMYYYY(new Date("01-01-2023"));
            expect(actual).toEqual(expected);
        });
    });

    describe("withTwoDigitYear", () => {
        it("return formated year", () => {
            const expected = "09/12/25";
            const actual = dateHelper.withTwoDigitYear(new Date("2025/12/09"));
            expect(actual).toEqual(expected);
        });
    });
});
