import ThaitiT from "./Thaiti-t";
import Thaiti from "./Thaiti";

const VALID_THAITI_T_LIST = ["A12345678", "123456789"];
const THAITI_LIST = ["A12345", "123456"];
const THAITI_T_TO_THAITI_MAP = VALID_THAITI_T_LIST.map((thaitiT, index) => [thaitiT, THAITI_LIST[index]]);

const INVALID_THAITI_T_LIST = ["12345678", "abcdefghi", "", undefined];

describe("ThaitiT", () => {
    describe("constructor", () => {
        it.each(VALID_THAITI_T_LIST)("should create an instance of ThaitiT with a valid 9-digit thaitiT", thaitiT => {
            const thaitiTInstance = new ThaitiT(thaitiT);
            expect(thaitiTInstance.value).toBe(thaitiT);
        });

        it.each(INVALID_THAITI_T_LIST)("should throw an error for an invalid thaitiT", thaitiT => {
            // @ts-expect-error
            expect(() => new ThaitiT(thaitiT)).toThrow(`Invalid ThaitiT: ${thaitiT}`);
        });
    });

    describe("isThaitiT", () => {
        it.each(VALID_THAITI_T_LIST)("should return true for a valid thaitiT", thaitiT => {
            expect(ThaitiT.isThaitiT(thaitiT)).toBe(true);
        });

        it.each(INVALID_THAITI_T_LIST)("should return false for an invalid thaitiT", thaitiT => {
            expect(ThaitiT.isThaitiT(thaitiT)).toBe(false);
        });
    });

    describe("value", () => {
        it.each(VALID_THAITI_T_LIST)("should return the thaitiT value", thaitiT => {
            const thaitiTInstance = new ThaitiT(thaitiT);
            expect(thaitiTInstance.value).toBe(thaitiT);
        });
    });

    describe("toThaiti", () => {
        it.each(THAITI_T_TO_THAITI_MAP)("should convert a ThaitiT to a Thaiti", (thaitiT, expectedThaiti) => {
            const thaitiTInstance = new ThaitiT(thaitiT);
            const thaiti = thaitiTInstance.toThaiti();
            expect(thaiti).toBeInstanceOf(Thaiti);
            expect(thaiti.value).toBe(expectedThaiti);
        });
    });
});
