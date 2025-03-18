import * as validators from "./Validators";

describe("Validators", () => {
    describe("isInObjectValues()", () => {
        it("should return false if object is empty", () => {
            const expected = false;
            const actual = validators.isInObjectValues({}, "morgane");
            expect(actual).toEqual(expected);
        });

        it("should return false if not in object", () => {
            const expected = false;
            const actual = validators.isInObjectValues({ name: "elise" }, "morgane");
            expect(actual).toEqual(expected);
        });

        it("should return true if in object", () => {
            const expected = true;
            const actual = validators.isInObjectValues({ name: "morgane" }, "morgane");
            expect(actual).toEqual(expected);
        });
    });

    describe("isStringDefined", () => {
        it("return true", () => {
            const expected = true;
            const actual = validators.isStringValid("cmd-name");
            expect(actual).toEqual(expected);
        });

        it("return true for empty string if option given", () => {
            const expected = true;
            const actual = validators.isStringValid("", { acceptEmpty: true });
            expect(actual).toEqual(expected);
        });

        it.each`
            param
            ${undefined}
            ${null}
            ${123}
        `("return fals if $param", ({ param }) => {
            const expected = false;
            const actual = validators.isStringValid(param);
            expect(actual).toEqual(expected);
        });
    });

    describe("isBooleanDefined", () => {
        it.each`
            bool
            ${true}
            ${false}
            ${"false"}
            ${"true"}
        `("return true if $bool", ({ bool }) => {
            const expected = true;
            const actual = validators.isBooleanValid(bool);
            expect(actual).toEqual(expected);
        });

        it.each`
            bool
            ${undefined}
            ${null}
            ${""}
            ${"fals"}
            ${"truee"}
            ${123}
        `("return false if $bool", ({ bool }) => {
            const expected = false;
            const actual = validators.isBooleanValid(bool);
            expect(actual).toEqual(expected);
        });
    });

    // No need to mock DateHelper.shortISORegExp because it is a regexp and not a function
    describe("isShortISODateValid", () => {
        it("return true", () => {
            const expected = true;
            const actual = validators.isShortISODateValid("2025-01-01");
            expect(actual).toEqual(expected);
        });

        it.each`
            param
            ${"205-01-01"}
            ${"01-01-2025"}
            ${"20250101"}
            ${undefined}
            ${null}
        `("return false", ({ date }) => {
            const expected = false;
            const actual = validators.isShortISODateValid(date);
            expect(actual).toEqual(expected);
        });
    });
});
