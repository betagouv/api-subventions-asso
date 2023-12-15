import * as validators from "./Validators";

const RNA = "W123456789";
const SIRET = "12345678901234";
const SIREN = "123456789";

describe("Validators", () => {
    describe("isRna", () => {
        const isRna = validators.isRna;
        it("should return true with valid RNA", () => {
            const actual = isRna(RNA);
            expect(actual).toBeTruthy();
        });
        it("should return false with SIRET", () => {
            const actual = isRna(SIRET);
            expect(actual).toBeFalsy();
        });
        it("should return false with SIREN", () => {
            const actual = isRna(SIREN);
            expect(actual).toBeFalsy();
        });
    });

    describe("isSiret", () => {
        const isSiret = validators.isSiret;

        it("should return true with valid SIRET", () => {
            const actual = isSiret(SIRET);
            expect(actual).toBeTruthy();
        });

        it.each`
            value
            ${RNA}
            ${SIREN}
            ${"#"}
            ${""}
            ${null}
            ${undefined}
            ${false}
            ${true}
        `("should return false with $value", ({ value }) => {
            const actual = isSiret(value);
            expect(actual).toBeFalsy();
        });
        it("should return false with undefined", () => {
            // @ts-expect-error: test edge case
            const actual = isSiret(undefined);
            expect(actual).toBeFalsy();
        });
    });

    describe("isSiren", () => {
        const isSiren = validators.isSiren;
        it("should return true with valid SIREN", () => {
            const actual = isSiren(SIREN);
            expect(actual).toBeTruthy();
        });
        it("should return false with RNA", () => {
            const actual = isSiren(RNA);
            expect(actual).toBeFalsy();
        });
        it("should return false with SIRET", () => {
            const actual = isSiren(SIRET);
            expect(actual).toBeFalsy();
        });
    });

    describe("isStartOfSiret", () => {
        const isStartOfSiret = validators.isStartOfSiret;
        it("should return true with valid SIREN", () => {
            const actual = isStartOfSiret(SIREN);
            expect(actual).toBeTruthy();
        });
        it("should return false with RNA", () => {
            const actual = isStartOfSiret(RNA);
            expect(actual).toBeFalsy();
        });
        it("should return true with SIRET", () => {
            const actual = isStartOfSiret(SIRET);
            expect(actual).toBeTruthy();
        });

        it("should return true with part of SIRET", () => {
            const actual = isStartOfSiret(SIRET.slice(0, 12));
            expect(actual).toBeTruthy();
        });
    });

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
