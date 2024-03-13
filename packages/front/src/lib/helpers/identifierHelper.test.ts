import * as IdentifierHelper from "./identifierHelper";
import * as StringHelper from "./stringHelper";
vi.mock("./stringHelper");

describe("IdentifierHelper", () => {
    describe("isRna", () => {
        it("should call StringHelper.removeWhiteSpace", () => {
            const rna = "W000000000";
            IdentifierHelper.isRna(rna);
            expect(vi.mocked(StringHelper.removeWhiteSpace)).toHaveBeenCalledWith(rna);
        });

        it.each`
            rna
            ${"W000000000"}
            ${"W0P0000000"}
        `("should return true", ({ rna }) => {
            const expected = true;
            vi.mocked(StringHelper.removeWhiteSpace).mockReturnValue(rna);
            const actual = IdentifierHelper.isRna(rna);
            expect(actual).toEqual(expected);
        });

        it.each`
            rna
            ${"W00000000"}
            ${"WP00000000"}
            ${"W00P000000"}
        `("should return false", ({ rna }) => {
            vi.mocked(StringHelper.removeWhiteSpace).mockReturnValue(rna);
            const expected = false;
            const actual = IdentifierHelper.isRna(rna);
            expect(actual).toEqual(expected);
        });
    });

    describe("isSiren", () => {
        it("should call StringHelper.removeWhiteSpace", () => {
            const siren = "125 896 475";
            IdentifierHelper.isSiren(siren);
            expect(vi.mocked(StringHelper.removeWhiteSpace)).toHaveBeenCalledWith(siren);
        });

        it("should return true", () => {
            const validSiren = "125896475";
            vi.mocked(StringHelper.removeWhiteSpace).mockReturnValue(validSiren);
            const expected = true;
            const actual = IdentifierHelper.isSiren(validSiren);
            expect(actual).toEqual(expected);
        });

        it("should return false", () => {
            const invalidSiren = "A896475";
            vi.mocked(StringHelper.removeWhiteSpace).mockReturnValue(invalidSiren);
            const expected = false;
            const actual = IdentifierHelper.isSiren(invalidSiren);
            expect(actual).toEqual(expected);
        });
    });

    describe("isSiret", () => {
        it("should call StringHelper.removeWhiteSpace", () => {
            const siret = "125 896 475 00018";
            IdentifierHelper.isSiret(siret);
            expect(vi.mocked(StringHelper.removeWhiteSpace)).toHaveBeenCalledWith(siret);
        });

        it("should return true", () => {
            const validSiret = "12589647500018";
            vi.mocked(StringHelper.removeWhiteSpace).mockReturnValue(validSiret);
            const expected = true;
            const actual = IdentifierHelper.isSiret(validSiret);
            expect(actual).toEqual(expected);
        });

        it("should return false", () => {
            const invalidSiret = "Z2589647500018";
            vi.mocked(StringHelper.removeWhiteSpace).mockReturnValueOnce(invalidSiret);
            const expected = false;
            const actual = IdentifierHelper.isSiret(invalidSiret);
            expect(actual).toEqual(expected);
        });
    });

    // TODO/STUCK: Could not find a way to test exported named function that calls exported named function from the same file
    // this is why isIdentifier() is not tested because calls to validators cannot be mocked when we use standard vi.mock()
    // maybe there is a way to import isIdentifier inline after mocking validators...
});
