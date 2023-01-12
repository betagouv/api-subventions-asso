import * as DateHelper from "./dateHelper";

describe("DateHelper", () => {
    describe("DDMMYYYYDate()", () => {
        it("should return MM/DD/YYYY date", () => {
            const expected = "01/01/2023";
            const actual = DateHelper.MMDDYYYDate(new Date("01-01-2023"));
            expect(actual).toEqual(expected);
        });
    });
});
