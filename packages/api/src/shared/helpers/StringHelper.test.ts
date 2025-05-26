import * as StringHelper from "./StringHelper";
import crypto from "crypto";
jest.mock("crypto", () => ({
    createHash: jest.fn(() => ({
        update: jest.fn(() => ({
            digest: jest.fn(() => {}),
        })),
    })),
}));
const mockedCrypto = jest.mocked(crypto);

describe("StringHelper", () => {
    describe("sanitizeToPlainText", () => {
        it("sanitizes script", () => {
            const expected = "test";
            const actual = StringHelper.sanitizeToPlainText("<script>don't keep me</script>test");
            expect(actual).toBe(expected);
        });

        it("removes formatting tags", () => {
            const expected = "test";
            const actual = StringHelper.sanitizeToPlainText("<b>test</b>");
            expect(actual).toBe(expected);
        });
    });

    describe("capitalizeFirstLetter()", () => {
        it("should return a string with only first letter in upper case", () => {
            const expected = "Lorem";
            const actual = StringHelper.capitalizeFirstLetter("lOReM");
            expect(actual).toEqual(expected);
        });
    });

    describe("getMD5", () => {
        const digest = jest.fn();
        const update = jest.fn(() => ({ digest }));

        beforeAll(() =>
            // @ts-expect-error: mock
            mockedCrypto.createHash.mockImplementation(() => ({ update })),
        );

        it("return call crypto methods", () => {
            const str = "STRING";
            StringHelper.getMD5(str);
            expect(mockedCrypto.createHash).toHaveBeenCalledWith("md5");
            expect(update).toHaveBeenCalledWith(str);
            expect(digest).toHaveBeenCalledWith("hex");
        });
    });

    describe("removeWhitespaces", () => {
        it("removes whitespaces", () => {
            const expected = "41116978200017";
            const actual = StringHelper.removeWhitespace("411 169 782 00017");
            expect(actual).toEqual(expected);
        });

        it.each`
            value
            ${123}
            ${null}
            ${undefined}
            ${{}}
            ${[]}
            ${NaN}
        `("return value if $value given", ({ value }) => {
            const expected = value;
            const actual = StringHelper.removeWhitespace(value);
            expect(actual).toEqual(expected);
        });
    });
});
