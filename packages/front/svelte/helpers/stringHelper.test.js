import * as StringHelper from "./stringHelper";

describe("StringHelper", () => {
    describe("isHyphen", () => {
        const testIsHyphen = ({ entry, expected }) => {
            const actual = StringHelper.isHyphen(entry);
            expect(actual).toEqual(expected);
        };

        it.each`
            entry            | expected
            ${"NO_HYPHEN"}   | ${false}
            ${"WITH-HYPHEN"} | ${false}
        `("should return false", testIsHyphen);

        it("should return true", () => testIsHyphen({ entry: "-", expected: true }));
    });

    describe("capitalizeFirstLetter", () => {
        it("return string if empty", () => {
            const actual = StringHelper.capitalizeFirstLetter("");
            expect(actual).toBe("");
        });

        it("returns uppercase string if length 1", () => {
            const expected = "A";
            const actual = StringHelper.capitalizeFirstLetter("a");
            expect(actual).toBe(expected);
        });

        it("returns capitalized string", () => {
            const expected = "Bonjour";
            const actual = StringHelper.capitalizeFirstLetter("bOnjOur");
            expect(actual).toBe(expected);
        });
    });

    describe("trim", () => {
        const STR = "relatively long string";
        it("if string is short enough returns arg", () => {
            const expected = STR;
            const actual = StringHelper.trim(STR, 25);
            expect(actual).toBe(expected);
        });

        it("if length is less than 3 trims to 'length' without dots", () => {
            const expected = "re";
            const actual = StringHelper.trim(STR, 2);
            expect(actual).toBe(expected);
        });

        it("in general trims to 'length' with dots", () => {
            const expected = "re...";
            const actual = StringHelper.trim(STR, 5);
            expect(actual).toBe(expected);
        });
    });
});
