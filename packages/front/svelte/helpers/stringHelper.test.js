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
});
