import Siret from "./Siret";
import Siren from "./Siren";

const VALID_SIRET_LIST = ["12345678901234", "98765432109876", "11111111111111"];
const INVALID_SIRET_LIST = ["1234567890123", "123456789012345", "1234567890123a", "", null, undefined];

const VALID_START_OF_SIRET_LIST = ["123456789", "1234567890", "12345678901234", "123456789012345"];
const INVALID_START_OF_SIRET_LIST = ["12345678", "123a567890", "", undefined];

describe("Siret", () => {
    describe("constructor", () => {
        it.each(VALID_SIRET_LIST)("should create an instance of Siret with a valid siret", siret => {
            const siretInstance = new Siret(siret);
            expect(siretInstance.value).toBe(siret);
        });

        it.each(INVALID_SIRET_LIST)("should throw an error for an invalid siret", siret => {
            // @ts-expect-error: test edge cases
            expect(() => new Siret(siret)).toThrow(`Invalid Siret : ${siret}`);
        });
    });

    describe("isSiret", () => {
        it.each(VALID_SIRET_LIST)("should return true for a valid siret", siret => {
            expect(Siret.isSiret(siret)).toBe(true);
        });

        it.each(INVALID_SIRET_LIST)("should return false for an invalid siret", siret => {
            expect(Siret.isSiret(siret)).toBe(false);
        });
    });

    describe("isStartOfSiret", () => {
        it.each(VALID_START_OF_SIRET_LIST)("should return true for a valid start of siret", siret => {
            expect(Siret.isStartOfSiret(siret)).toBe(true);
        });

        it.each(INVALID_START_OF_SIRET_LIST)("should return false for an invalid start of siret", siret => {
            expect(Siret.isStartOfSiret(siret)).toBe(false);
        });
    });

    describe("value", () => {
        it.each(VALID_SIRET_LIST)("should return the siret value", siret => {
            const siretInstance = new Siret(siret);
            expect(siretInstance.value).toBe(siret);
        });
    });

    describe("toSiren", () => {
        it("should return a Siren instance with the first 9 digits", () => {
            const siretInstance = new Siret("12345678901234");
            const siren = siretInstance.toSiren();

            expect(siren).toBeInstanceOf(Siren);
            expect(siren.value).toBe("123456789");
        });
    });

    describe("getNic", () => {
        it("should return the NIC for a valid siret", () => {
            expect(Siret.getNic("12345678901234")).toBe("01234");
            expect(Siret.getNic("98765432109876")).toBe("09876");
        });

        it.each(INVALID_SIRET_LIST)("should throw an error for an invalid siret", siret => {
            // @ts-expect-error: test edge cases
            expect(() => Siret.getNic(siret)).toThrow(`Invalid Siret : ${siret}`);
        });
    });
});
