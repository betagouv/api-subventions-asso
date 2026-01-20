import { getOrInit } from "./array.helper";

describe("Array Helper", () => {
    describe("getOrInit", () => {
        it("initialize array if not defined", () => {
            const expected = [];
            const actual = getOrInit(undefined);
            expect(actual).toEqual(expected);
        });

        it("returns given array if defined", () => {
            const ARRAY = [{ foo: "bar" }];
            const expected = ARRAY;
            const actual = getOrInit(ARRAY);
            expect(actual).toEqual(expected);
        });
    });
});
