import * as ArrayHelper from "./ArrayHelper";

describe("ArrayHelper", () => {
    describe("commpare()", () => {
        it("should return -1", () => {
            const expected = -1;
            const actual = ArrayHelper.compare("a", "b");
            expect(actual).toEqual(expected);
        });

        it("should return 1", () => {
            const expected = 1;
            const actual = ArrayHelper.compare("b", "a");
            expect(actual).toEqual(expected);
        });

        it("should return 0", () => {
            const expected = 0;
            const actual = ArrayHelper.compare("a", "a");
            expect(actual).toEqual(expected);
        });
    });

    describe("compareByValue()", () => {
        it("should return a function", () => {
            const expected = "function";
            const actual = typeof ArrayHelper.compareByValueBuilder("provider");
            expect(actual).toEqual(expected);
        });

        it("should compare on value", () => {
            const objA = { provider: "ABC" };
            const objB = { provider: "BCD" };
            const expected = [objA, objB];
            const actual = [objB, objA].sort(ArrayHelper.compareByValueBuilder("provider"));
            expect(actual).toEqual(expected);
        });

        it("should compare on deep value", () => {
            const objA = { siret: { provider: "ABC" } };
            const objB = { siret: { provider: "BCD" } };
            const expected = [objA, objB];
            const actual = [objB, objA].sort(ArrayHelper.compareByValueBuilder("siret.provider"));
            expect(actual).toEqual(expected);
        });
    });

    describe("joinEnum", () => {
        const ENUM = {
            A: "A",
            B: "B",
            C: "C",
        };

        it("should join enum with comma", () => {
            const expected = "A, B, C";
            const actual = ArrayHelper.joinEnum(ENUM);
            expect(actual).toEqual(expected);
        });
    });

    describe("asyncForEach", () => {
        it("executes array of promise synchronously", async () => {
            const mockFn = jest.fn();
            const array = ["one", "two", "three", " four", " five"];

            await ArrayHelper.asyncForEach(
                array,
                async str => new Promise(resolve => setTimeout(() => resolve(mockFn(str)), 500)),
            );

            array.map((str, index) => {
                expect(mockFn).toHaveBeenNthCalledWith(index + 1, str);
            });
        });
    });
});
