import * as IdentifierHelper from "./identifierHelper";
import * as StringHelper from "./stringHelper";
vi.mock("./stringHelper");

describe("IdentifierHelper", () => {
    const RNA = "W000000000";
    const SIREN = "125896475";
    const SIRET = "12589647500018";

    beforeEach(() => {
        vi.mocked(StringHelper.removeWhiteSpace).mockImplementation(rna => rna);
    });

    describe("isRna", () => {
        it("should call StringHelper.removeWhiteSpace", () => {
            IdentifierHelper.isRna(RNA);
            expect(vi.mocked(StringHelper.removeWhiteSpace)).toHaveBeenCalledWith(RNA);
        });

        it.each`
            rna
            ${RNA}
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
        it("should call StringHelper.removeWhiteSpace", () => {
            const siren = "125 896 475";
            IdentifierHelper.isSiren(siren);
            expect(vi.mocked(StringHelper.removeWhiteSpace)).toHaveBeenCalledWith(siren);
        });

        it("should return true", () => {
            const validSiren = SIREN;
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
            const validSiret = SIRET;
            vi.mocked(StringHelper.removeWhiteSpace).mockReturnValue(validSiret);
            const expected = true;
            const actual = IdentifierHelper.isSiret(validSiret);
            expect(actual).toEqual(expected);
        });

        it("should return false when siret more than 14 digits", () => {
            const invalidSiret = "123456789012345";
            vi.mocked(StringHelper.removeWhiteSpace).mockReturnValue(invalidSiret);
            const expected = false;
            const actual = IdentifierHelper.isSiret(invalidSiret);
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

    describe("isAssociationIdentifier", () => {
        it.each`
            expected | identifier   | test
            ${true}  | ${SIREN}     | ${"SIREN"}
            ${true}  | ${RNA}       | ${"RNA"}
            ${false} | ${SIRET}     | ${"SIRET"}
            ${false} | ${undefined} | ${"undefined"}
            ${false} | ${null}      | ${"null"}
            ${false} | ${""}        | ${"empty string"}
        `("returns $expected with $test", ({ expected, identifier }) => {
            const actual = IdentifierHelper.isAssociationIdentifier(identifier);
            expect(actual).toEqual(expected);
        });
    });

    // TODO/STUCK: Could not find a way to test exported named function that calls exported named function from the same file
    // this is why isIdentifier() is not tested because calls to validators cannot be mocked when we use standard vi.mock()
    // maybe there is a way to import isIdentifier inline after mocking validators...
});
