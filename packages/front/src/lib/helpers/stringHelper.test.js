import * as StringHelper from "./stringHelper";
import { isPhoneNumber } from "./stringHelper";

describe("StringHelper", () => {
    describe("isHyphen", () => {
        /* eslint-disable vitest/expect-expect -- use helper */
        const testIsHyphen = ({ entry, expected }) => {
            const actual = StringHelper.isHyphen(entry);
            expect(actual).toEqual(expected);
        };

        it.each`
            entry            | expected
            ${"NO_HYPHEN"}   | ${false}
            ${"WITH-HYPHEN"} | ${false}
        `("should return false", testIsHyphen);

        it("should return true", () => testIsHyphen({ entry: "-", expected: true }));
        /* eslint-enable vitest/expect-expect */
    });

    describe("capitalizeFirstLetter", () => {
        it("return string if empty", () => {
            const actual = StringHelper.capitalizeFirstLetter("");
            expect(actual).toBe("");
        });

        it("returns uppercase string if length 1", () => {
            const expected = "A";
            const actual = StringHelper.capitalizeFirstLetter("a");
            expect(actual).toBe(expected);
        });

        it("returns capitalized string", () => {
            const expected = "Bonjour";
            const actual = StringHelper.capitalizeFirstLetter("bOnjOur");
            expect(actual).toBe(expected);
        });
    });

    describe("trim", () => {
        const STR = "relatively long string";
        it("if string is short enough returns arg", () => {
            const expected = STR;
            const actual = StringHelper.trim(STR, 25);
            expect(actual).toBe(expected);
        });

        it("if length is less than 3 trims to 'length' without dots", () => {
            const expected = "re";
            const actual = StringHelper.trim(STR, 2);
            expect(actual).toBe(expected);
        });

        it("in general trims to 'length' with dots", () => {
            const expected = "re...";
            const actual = StringHelper.trim(STR, 5);
            expect(actual).toBe(expected);
        });
    });

    describe("isPhoneNumber", () => {
        it("accepts phone number with + and space", () => {
            expect(isPhoneNumber("+33 1 00 00 00 00")).toBeTruthy();
        });

        it("accepts phone number with + and no separator", () => {
            expect(isPhoneNumber("+33100000000")).toBeTruthy();
        });

        it("accepts phone number 0 and dash", () => {
            expect(isPhoneNumber("01-00-00-00-00")).toBeTruthy();
        });

        it("accepts phone number 0 and dot", () => {
            expect(isPhoneNumber("01.00.00.00.00")).toBeTruthy();
        });

        it("accepts phone number from Guadeloupe", () => {
            expect(isPhoneNumber("+590 590 99 39 00")).toBeTruthy();
        });

        it("rejects letters", () => {
            expect(isPhoneNumber("01.00.aa.00.00")).toBeFalsy();
        });

        // test skipped because it specifies French phone numbers only
        it.skip("rejects longer numbers", () => {
            expect(isPhoneNumber("01.00.00.00.005")).toBeFalsy();
        });

        // test skipped because it specifies French phone numbers only
        it.skip("rejects shorter numbers", () => {
            expect(isPhoneNumber("+331.00.00.00.0")).toBeFalsy();
        });

        // test skipped because it specifies French phone numbers only
        it.skip("rejects disorganized", () => {
            expect(isPhoneNumber("+331.0000.0.00.00")).toBeFalsy();
        });
    });

    describe("removeWhiteSpace", () => {
        it("should do nothing", () => {
            const expected = "1234";
            const actual = StringHelper.removeWhiteSpace("1234");
            expect(actual).toEqual(expected);
        });

        it("should remove white space", () => {
            const expected = "1234";
            const actual = StringHelper.removeWhiteSpace("12 34");
            expect(actual).toEqual(expected);
        });
    });
});
