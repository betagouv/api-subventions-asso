import * as dateHelper from "./dateHelper.js";

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

    describe("dateToFullFrenchDateWithHour", () => {
        it("should return correct date format if param is type Date", () => {
            const dateToFormat = new Date(2025, 11, 5, 10, 30);
            const expected = "5 décembre 2025 à 10h30";
            const actual = dateHelper.dateToFullFrenchDateWithHour(dateToFormat);
            expect(actual).toEqual(expected);
        });

        it("should return correct date format if param is type string", () => {
            const dateToFormat = new Date(2025, 11, 5, 10, 30).toString();
            const expected = "5 décembre 2025 à 10h30";
            const actual = dateHelper.dateToFullFrenchDateWithHour(dateToFormat);
            expect(actual).toEqual(expected);
        });

        it("throw error if incorrect date", () => {
            const dateToFormat = "incorrect date";
            expect(() => dateHelper.dateToFullFrenchDateWithHour(dateToFormat)).toThrowError(RangeError);
        });
    });
});
