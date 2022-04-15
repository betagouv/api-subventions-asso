import * as StringHelper from "../../../src/shared/helpers/StringHelper";

describe("StringHelper", () => {
    describe("capitalizeFirstLetter()", () => {
        it("should return a string with only first letter in upper case", () => {
            const expected = "Lorem";
            const actual = StringHelper.capitalizeFirstLetter("lOReM");
            expect(actual).toEqual(expected);
        })
    } )
})