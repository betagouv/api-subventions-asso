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
        })
        it("should return false with SIRET", () => {
            const actual = isRna(SIRET);
            expect(actual).toBeFalsy();
        })
        it("should return false with SIREN", () => {
            const actual = isRna(SIREN);
            expect(actual).toBeFalsy();
        })
    });

    describe("isSiret", () => {
        const isSiret = validators.isSiret;
        it("should return true with valid SIRET", () => {
            const actual = isSiret(SIRET);
            expect(actual).toBeTruthy();
        })
        it("should return false with RNA", () => {
            const actual = isSiret(RNA);
            expect(actual).toBeFalsy();
        })
        it("should return false with SIREN", () => {
            const actual = isSiret(SIREN);
            expect(actual).toBeFalsy();
        })
    });

    describe("isSiren", () => {
        const isSiren = validators.isSiren;
        it("should return true with valid SIREN", () => {
            const actual = isSiren(SIREN);
            expect(actual).toBeTruthy();
        })
        it("should return false with RNA", () => {
            const actual = isSiren(RNA);
            expect(actual).toBeFalsy();
        })
        it("should return false with SIRET", () => {
            const actual = isSiren(SIRET);
            expect(actual).toBeFalsy();
        })
    });

    describe("isStartOfSiret", () => {
        const isStartOfSiret = validators.isStartOfSiret;
        it("should return true with valid SIREN", () => {
            const actual = isStartOfSiret(SIREN);
            expect(actual).toBeTruthy();
        })
        it("should return false with RNA", () => {
            const actual = isStartOfSiret(RNA);
            expect(actual).toBeFalsy();
        })
        it("should return true with SIRET", () => {
            const actual = isStartOfSiret(SIRET);
            expect(actual).toBeTruthy();
        })

        it("should return true with part of SIRET", () => {
            const actual = isStartOfSiret(SIRET.slice(0,12));
            expect(actual).toBeTruthy();
        })
    });
});