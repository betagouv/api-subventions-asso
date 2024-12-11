import Thaiti from "./Thaiti";

const VALID_THAITI_LIST = ["A12345", "123456"];
const INVALID_THAITI_LIST = ["12345", "abcdef", "", undefined];

describe("Thaiti", () => {
    describe("constructor", () => {
        it.each(VALID_THAITI_LIST)("should create an instance of Thaiti with a valid thaiti", thaiti => {
            const thaitiInstance = new Thaiti(thaiti);
            expect(thaitiInstance.value).toBe(thaiti);
        });

        it.each(INVALID_THAITI_LIST)("should throw an error for an invalid thaiti", thaiti => {
            // @ts-expect-error
            expect(() => new Thaiti(thaiti)).toThrow(`Invalid Thaiti: ${thaiti}`);
        });
    });

    describe("isThaiti", () => {
        it.each(VALID_THAITI_LIST)("should return true for a valid thaiti", thaiti => {
            expect(Thaiti.isThaiti(thaiti)).toBe(true);
        });

        it.each(INVALID_THAITI_LIST)("should return false for an invalid thaiti", thaiti => {
            expect(Thaiti.isThaiti(thaiti)).toBe(false);
        });
    });

    describe("value", () => {
        it.each(VALID_THAITI_LIST)("should return the thaiti value", thaiti => {
            const thaitiInstance = new Thaiti(thaiti);
            expect(thaitiInstance.value).toBe(thaiti);
        });
    });
});
