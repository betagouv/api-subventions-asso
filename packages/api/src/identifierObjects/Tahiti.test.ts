import Tahiti from "./Tahiti";

const VALID_THAITI_LIST = ["A12345", "123456"];
const INVALID_THAITI_LIST = ["12345", "abcdef", "", undefined];

describe("Tahiti", () => {
    describe("constructor", () => {
        it.each(VALID_THAITI_LIST)("should create an instance of Tahiti with a valid tahiti", tahiti => {
            const thaitiInstance = new Tahiti(tahiti);
            expect(thaitiInstance.value).toBe(tahiti);
        });

        it.each(INVALID_THAITI_LIST)("should throw an error for an invalid tahiti", tahiti => {
            // @ts-expect-error: test edge cases
            expect(() => new Tahiti(tahiti)).toThrow(`Invalid Tahiti: ${tahiti}`);
        });
    });

    describe("isTahiti", () => {
        it.each(VALID_THAITI_LIST)("should return true for a valid tahiti", tahiti => {
            expect(Tahiti.isTahiti(tahiti)).toBe(true);
        });

        it.each(INVALID_THAITI_LIST)("should return false for an invalid tahiti", tahiti => {
            expect(Tahiti.isTahiti(tahiti)).toBe(false);
        });
    });

    describe("value", () => {
        it.each(VALID_THAITI_LIST)("should return the tahiti value", tahiti => {
            const thaitiInstance = new Tahiti(tahiti);
            expect(thaitiInstance.value).toBe(tahiti);
        });
    });
});
