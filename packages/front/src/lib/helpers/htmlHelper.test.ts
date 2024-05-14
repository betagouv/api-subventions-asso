import { isValidButtonType } from "./htmlHelper";

describe("HTML helper", () => {
    describe("isValidButtonType()", () => {
        it.each`
            value
            ${"submit"}
            ${"button"}
            ${"reset"}
        `("should return true", ({ value }) => {
            const expected = true;
            const actual = isValidButtonType(value);
            expect(actual).toEqual(expected);
        });

        it.each`
            value
            ${"sub"}
            ${""}
            ${null}
            ${undefined}
        `("should return false", ({ value }) => {
            const expected = false;
            const actual = isValidButtonType(value);
            expect(actual).toEqual(expected);
        });
    });
});
