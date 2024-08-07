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
});
