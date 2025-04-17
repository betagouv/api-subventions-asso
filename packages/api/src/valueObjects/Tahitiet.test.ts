import Tahitiet from "./Tahitiet";
import Tahiti from "./Tahiti";

const VALID_THAITI_T_LIST = ["A12345678", "b12345678", "123456789"];
const THAITI_LIST = ["A12345", "b12345", "123456"];
const THAITI_T_TO_THAITI_MAP = VALID_THAITI_T_LIST.map((tahitiet, index) => [tahitiet, THAITI_LIST[index]]);

const INVALID_THAITI_T_LIST = ["12345678", "abcdefghi", "", undefined];

describe("Tahitiet", () => {
    describe("constructor", () => {
        it.each(VALID_THAITI_T_LIST)(
            "should create an instance of Tahitiet with a valid 9-digit tahitiet",
            tahitiet => {
                const tahitietInstance = new Tahitiet(tahitiet);
                expect(tahitietInstance.value).toBe(tahitiet);
            },
        );

        it.each(INVALID_THAITI_T_LIST)("should throw an error for an invalid tahitiet", tahitiet => {
            // @ts-expect-error
            expect(() => new Tahitiet(tahitiet)).toThrow(`Invalid Tahitiet: ${tahitiet}`);
        });
    });

    describe("isTahitiet", () => {
        it.each(VALID_THAITI_T_LIST)("should return true for a valid tahitiet", tahitiet => {
            expect(Tahitiet.isTahitiet(tahitiet)).toBe(true);
        });

        it.each(INVALID_THAITI_T_LIST)("should return false for an invalid tahitiet", tahitiet => {
            expect(Tahitiet.isTahitiet(tahitiet)).toBe(false);
        });
    });

    describe("value", () => {
        it.each(VALID_THAITI_T_LIST)("should return the tahitiet value", tahitiet => {
            const tahitietInstance = new Tahitiet(tahitiet);
            expect(tahitietInstance.value).toBe(tahitiet);
        });
    });

    describe("toTahiti", () => {
        it.each(THAITI_T_TO_THAITI_MAP)("should convert a Tahitiet to a Tahiti", (tahitiet, expected) => {
            const tahitietInstance = new Tahitiet(tahitiet);
            const actual = tahitietInstance.toTahiti();
            expect(actual).toBeInstanceOf(Tahiti);
            expect(actual.value).toBe(expected);
        });
    });
});
