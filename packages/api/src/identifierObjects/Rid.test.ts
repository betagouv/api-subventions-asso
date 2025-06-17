import Rid from "./Rid";

const VALID_RID_LIST = ["1234567", "123456"];
const INVALID_RID_LIST = ["12345", "abcdefg", "", undefined];

describe("Rid", () => {
    describe("constructor", () => {
        it.each(VALID_RID_LIST)("should create an instance of Rid with a valiid rid", rid => {
            const ridInstance = new Rid(rid);
            expect(ridInstance.value).toBe(rid);
        });

        it.each(INVALID_RID_LIST)("should throw an error for an invalid rid", rid => {
            // @ts-expect-error: test edge cases
            expect(() => new Rid(rid)).toThrow(`Invalid Rid: ${rid}`);
        });
    });

    describe("isRid", () => {
        it.each(VALID_RID_LIST)("should return true for a valid rid", rid => {
            expect(Rid.isRid(rid)).toBe(true);
        });

        it.each(INVALID_RID_LIST)("should return false for an invalid rid", rid => {
            expect(Rid.isRid(rid)).toBe(false);
        });
    });

    describe("value", () => {
        it.each(VALID_RID_LIST)("should return the rid value", rid => {
            const ridInstance = new Rid(rid);
            expect(ridInstance.value).toBe(rid);
        });
    });
});
