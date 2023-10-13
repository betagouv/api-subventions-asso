import * as StringHelper from "./StringHelper";

describe("StringHelper", () => {
    describe("sanitizeToPlainText", () => {
        it("sanitizes script", () => {
            const expected = "test";
            const actual = StringHelper.sanitizeToPlainText("<script>don't keep me</script>test");
            expect(actual).toBe(expected);
        });

        it("removes formatting tags", () => {
            const expected = "test";
            const actual = StringHelper.sanitizeToPlainText("<b>test</b>");
            expect(actual).toBe(expected);
        });
    });

    describe("capitalizeFirstLetter()", () => {
        it("should return a string with only first letter in upper case", () => {
            const expected = "Lorem";
            const actual = StringHelper.capitalizeFirstLetter("lOReM");
            expect(actual).toEqual(expected);
        });
    });
});
