import { addWithNull } from "./NumberHelper";

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
});
