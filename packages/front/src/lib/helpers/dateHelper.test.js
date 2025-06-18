import * as dateHelper from "./dateHelper";

describe("DateHelper", () => {
    describe("dateToDDMMYYYY()", () => {
        it("should return DD/MM/YYYY date", () => {
            const expected = "01/01/2023";
            const actual = dateHelper.dateToDDMMYYYY(new Date("01-01-2023"));
            expect(actual).toEqual(expected);
        });
    });
});
