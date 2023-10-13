import ProviderValueFactory from "./ProviderValueFactory";

describe("ProviderValueFactory", () => {
    describe("buildProviderValueAdapter", () => {
        it("should return function", () => {
            const actual = ProviderValueFactory.buildProviderValueAdapter("TEST", new Date());
            const expected = expect.any(Function);
            expect(actual).toEqual(expected);
        });

        it("should return function", () => {
            const now = new Date();
            const func = ProviderValueFactory.buildProviderValueAdapter("TEST", now);
            const actual = func("STRING_VALUE");
            const expected = {
                provider: "TEST",
                value: "STRING_VALUE",
                last_update: now,
                type: "string",
            };
            expect(actual).toEqual(expected);
        });
    });

    describe("buildProviderValuesAdapter", () => {
        it("should return function", () => {
            const actual = ProviderValueFactory.buildProviderValuesAdapter("TEST", new Date());
            const expected = expect.any(Function);
            expect(actual).toEqual(expected);
        });

        it("should return function", () => {
            const now = new Date();
            const func = ProviderValueFactory.buildProviderValuesAdapter("TEST", now);
            const actual = func("STRING_VALUE");
            const expected = expect.arrayContaining([
                {
                    provider: "TEST",
                    value: "STRING_VALUE",
                    last_update: now,
                    type: "string",
                },
            ]);
            expect(actual).toEqual(expected);
        });
    });
});
