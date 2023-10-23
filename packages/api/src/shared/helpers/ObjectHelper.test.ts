import * as ObjectHelper from "./ObjectHelper";

describe("ObjectHelper", () => {
    describe("isEmpty", () => {
        it("should return true if object without props", () => {
            const actual = ObjectHelper.isEmpty({});
            expect(actual).toBe(true);
        });

        it("should return true if object has undefined properties", () => {
            const actual = ObjectHelper.isEmpty({ foo: undefined, bar: null });
            expect(actual).toBe(false);
        });

        it("should return false if object has defined properties", () => {
            const actual = ObjectHelper.isEmpty({ foo: "foo", bar: [] });
            expect(actual).toBe(false);
        });
    });

    describe("hasEmptyProperties", () => {
        it("should return true if object without props", () => {
            const actual = ObjectHelper.hasEmptyProperties({});
            expect(actual).toBe(true);
        });

        it("should return true if object has undefined properties", () => {
            const actual = ObjectHelper.hasEmptyProperties({ foo: undefined, bar: null });
            expect(actual).toBe(true);
        });

        it("should return false if object has defined properties", () => {
            const actual = ObjectHelper.hasEmptyProperties({ foo: "foo", bar: [] });
            expect(actual).toBe(false);
        });
    });
});
