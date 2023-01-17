import * as textHelper from "./textHelper";
import * as dateHelper from "./dateHelper";

describe("DateHelper", () => {
    describe("dateToDDMMYYYY()", () => {
        it("should return DD/MM/YYYY date", () => {
            const expected = "01/01/2023";
            const actual = dateHelper.dateToDDMMYYYY(new Date("01-01-2023"));
            expect(actual).toEqual(expected);
        });
    });

    describe("getOneYearBeforeDate", () => {
        it("should return start date", async () => {
            const expected = new Date(2021, 10, 13);

            const endDate = new Date(2022, 10, 12);

            const actual = dateHelper.getOneYearBeforeDate(endDate);

            expect(actual).toEqual(expected);
        });
    });
});

describe("dateHelper", () => {
    const MONTH_ID = 6;
    const CAPITALIZED = "Juillet";
    const LOWERCASE = "juillet";
    const capitalizeMock = jest.spyOn(textHelper, "capitalizeFirstLetter").mockReturnValue(CAPITALIZED);
    describe("monthIdCapitalized", () => {
        it("calls capitalization with lowercase month", () => {
            const expected = LOWERCASE;
            dateHelper.monthCapitalizedFromId(MONTH_ID);
            expect(capitalizeMock).toBeCalledWith(expected);
        });

        it("returns capitalized month", () => {
            const actual = dateHelper.monthCapitalizedFromId(MONTH_ID);
            const expected = CAPITALIZED;
            expect(actual).toBe(expected);
        });
    });
});
