import Ridet from "./Ridet";
import Rid from "./Rid";

const VALID_RIDET_LIST = ["1234567890", "123456789"];
const RID_LIST = ["1234567", "123456"];
const RIDET_TO_RID_MAP = VALID_RIDET_LIST.map((ridet, index) => [ridet, RID_LIST[index]]);

const INVALID_RIDET_LIST = ["12345678", "abcdefghij", "", undefined];

describe("Ridet", () => {
    describe("constructor", () => {
        it.each(VALID_RIDET_LIST)("should create an instance of Ridet with a valid ridet", ridet => {
            const ridetInstance = new Ridet(ridet);
            expect(ridetInstance.value).toBe(ridet);
        });

        it.each(INVALID_RIDET_LIST)("should throw an error for an invalid ridet", ridet => {
            // @ts-expect-error: test edge cases
            expect(() => new Ridet(ridet)).toThrow(`Invalid Ridet: ${ridet}`);
        });
    });

    describe("isRidet", () => {
        it.each(VALID_RIDET_LIST)("should return true for a valid ridet", ridet => {
            expect(Ridet.isRidet(ridet)).toBe(true);
        });

        it.each(INVALID_RIDET_LIST)("should return false for an invalid ridet", ridet => {
            expect(Ridet.isRidet(ridet)).toBe(false);
        });
    });

    describe("value", () => {
        it.each(VALID_RIDET_LIST)("should return the ridet value", ridet => {
            const ridetInstance = new Ridet(ridet);
            expect(ridetInstance.value).toBe(ridet);
        });
    });

    describe("toRid", () => {
        it.each(RIDET_TO_RID_MAP)("should convert a Ridet to a Rid", (ridet, expected) => {
            const ridetInstance = new Ridet(ridet);
            const actual = ridetInstance.toRid();
            expect(actual).toBeInstanceOf(Rid);
            expect(actual.value).toBe(expected);
        });
    });
});
