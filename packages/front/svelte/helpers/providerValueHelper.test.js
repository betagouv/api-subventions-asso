import * as ProviderValueHelper from "./providerValueHelper";

describe("providerValueHelper", () => {
    const PROVIDER_VALUE = {
        value: "VALUE",
        provider: "PROVIDER",
        last_update: new Date(),
    };

    // TODO: flatenProviderValue

    describe("getPropFromProviderValue()", () => {
        it("should return a function", () => {
            const expected = "function";
            const actual = typeof ProviderValueHelper.getPropFromProviderValue("prop");
            expect(actual).toEqual(expected);
        });
    });

    describe("getValue()", () => {
        it("should return ProviderValue.value", () => {
            const expected = PROVIDER_VALUE.value;
            const actual = ProviderValueHelper.getValue(PROVIDER_VALUE);
            expect(actual).toEqual(expected);
        });
    });

    describe("getProvider()", () => {
        it("should return ProviderValue.value", () => {
            const expected = PROVIDER_VALUE.provider;
            const actual = ProviderValueHelper.getProvider(PROVIDER_VALUE);
            expect(actual).toEqual(expected);
        });
    });

    describe("getDate()", () => {
        it("should return ProviderValue.last_update", () => {
            const expected = PROVIDER_VALUE.last_update.toString();
            const actual = ProviderValueHelper.getDate(PROVIDER_VALUE);
            expect(actual).toEqual(expected);
        });
    });

    describe("isProviderValue()", () => {
        it("should return true", () => {
            const expected = true;
            const actual = ProviderValueHelper.isProviderValue(PROVIDER_VALUE);
            expect(actual).toEqual(expected);
        });

        it("should return false if empty object", () => {
            const expected = false;
            const actual = ProviderValueHelper.isProviderValue({});
            expect(actual).toEqual(expected);
        });

        it("should return false if undefined", () => {
            const expected = false;
            const actual = ProviderValueHelper.isProviderValue(undefined);
            expect(actual).toEqual(expected);
        });
    });
});
