import { addWithNull, parseAmount } from "./NumberHelper";

describe("Number Helper", () => {
    describe("addWithNull", () => {
        it.each`
            values          | expected
            ${[15, 12]}     | ${27}
            ${[null, 12]}   | ${12}
            ${[12, null]}   | ${12}
            ${[null, null]} | ${null}
        `("adds values", ({ values, expected }) => {
            const actual = addWithNull(values[0], values[1]);
            expect(actual).toEqual(expected);
        });
    });

    describe("parseAmount", () => {
        it.each([
            { raw: "1,000,000.50", expected: 1000000.5 },
            { raw: "1,000.50", expected: 1000.5 },
            { raw: "1,000", expected: 1000 },
            { raw: "1000,50", expected: 1000.5 },
            { raw: "1000.50", expected: 1000.5 },
            { raw: "1 000 000", expected: 1000000 },
            { raw: "1 000", expected: 1000 },
            { raw: "1000", expected: 1000 },
            { raw: 1000.5, expected: 1000.5 },
            { raw: 1000, expected: 1000 },
        ])("parse $raw into $expected", ({ raw, expected }) => {
            expect(parseAmount(raw)).toEqual(expected);
        });
    });
});
