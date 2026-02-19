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
                async str => new Promise(resolve => setTimeout(() => resolve(mockFn(str)), 1)),
            );

            array.map((str, index) => {
                expect(mockFn).toHaveBeenNthCalledWith(index + 1, str);
            });
        });
    });

    describe("mergeMapArray", () => {
        it.each([
            {
                mapA: new Map([["foo", ["baz", "bar"]]]),
                mapB: new Map([["faa", ["baz", "bar"]]]),
                expected: new Map([
                    ["foo", ["baz", "bar"]],
                    ["faa", ["baz", "bar"]],
                ]),
            },
            {
                mapA: new Map([["foo", ["baz", "bar"]]]),
                mapB: new Map([["foo", ["baz", "doo"]]]),
                expected: new Map([["foo", ["baz", "bar", "baz", "doo"]]]),
            },
        ])("merges map containing arrays", ({ mapA, mapB, expected }) => {
            const actual = ArrayHelper.mergeMapArray(mapA, mapB);
            expect(actual).toEqual(expected);
        });
    });

    describe("groupByKeyFactory", () => {
        it("returns a reducer function", () => {
            const reducer = ArrayHelper.groupByKeyFactory("key");
            expect(reducer).toBeInstanceOf(Function);
        });

        it("returns a valid reducer", () => {
            const expected = {
                foo: [{ otherProp: "faa" }, { otherProp: "fuu" }],
                baz: [{ otherProp: "buz" }, { otherProp: "boz" }],
            };
            const reducer = ArrayHelper.groupByKeyFactory("key");
            const actual = [
                { key: "foo", otherProp: "faa" },
                { key: "foo", otherProp: "fuu" },
                { key: "baz", otherProp: "buz" },
                { key: "baz", otherProp: "boz" },
            ].reduce(reducer, {});
            expect(actual).toEqual(expected);
        });

        it("throws an error if items does not own given property", () => {
            const reducer = ArrayHelper.groupByKeyFactory("key");
            expect(() => [{}, {}].reduce(reducer, {})).toThrow(
                `Items in array must have property "key" to perform the group by`,
            );
        });
    });
});
