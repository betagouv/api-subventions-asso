import IdentifierHelper from "../../../src/shared/helpers/IdentifierHelper";

describe("IdentifierHelper", () => {
    describe("getIdentifierType()", () => {
        it("should return RNA", () => {
            const RNA = "W123456789"
            const expected = "RNA";
            const actual = IdentifierHelper.getIdentifierType(RNA);
            expect(actual).toEqual(expected);
        })
        it("should return SIRET", () => {
            const SIRET = "12345678901234"
            const expected = "SIRET";
            const actual = IdentifierHelper.getIdentifierType(SIRET);
            expect(actual).toEqual(expected);
        })
        it("should return SIREN", () => {
            const SIREN = "123456789"
            const expected = "SIREN";
            const actual = IdentifierHelper.getIdentifierType(SIREN);
            expect(actual).toEqual(expected);
        })
    } )
})