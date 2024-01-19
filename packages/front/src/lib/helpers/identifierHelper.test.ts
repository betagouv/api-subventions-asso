import * as IdentifierHelper from "./identifierHelper";

describe("IdentifierHelper", () => {
    describe("isRna", () => {
        it.each`
            rna
            ${"W000000000"}
            ${"W0P0000000"}
        `("should return true", ({ rna }) => {
            const expected = true;
            const actual = IdentifierHelper.isRna(rna);
            expect(actual).toEqual(expected);
        });

        it.each`
            rna
            ${"W00000000"}
            ${"WP00000000"}
            ${"W00P000000"}
        `("should return false", ({ rna }) => {
            const expected = false;
            const actual = IdentifierHelper.isRna(rna);
            expect(actual).toEqual(expected);
        });
    });

    describe("isSiren", () => {
        it("should return true", () => {
            const validSiren = "125896475";
            const expected = true;
            const actual = IdentifierHelper.isSiren(validSiren);
            expect(actual).toEqual(expected);
        });

        it("should return false", () => {
            const validSiren = "A896475";
            const expected = false;
            const actual = IdentifierHelper.isSiren(validSiren);
            expect(actual).toEqual(expected);
        });
    });

    describe("isSiret", () => {
        it("should return true", () => {
            const validSiret = "12589647500018";
            const expected = true;
            const actual = IdentifierHelper.isSiret(validSiret);
            expect(actual).toEqual(expected);
        });

        it("should return false", () => {
            const validSiret = "Z2589647500018";
            const expected = false;
            const actual = IdentifierHelper.isSiret(validSiret);
            expect(actual).toEqual(expected);
        });
    });

    // TODO/STUCK: Could not find a way to test exported named function that calls exported named function from the same file
    // this is why isIdentifier() is not tested because calls to validators cannot be mocked when we use standard vi.mock()
    // maybe there is a way to import isIdentifier inline after mocking validators...
});
