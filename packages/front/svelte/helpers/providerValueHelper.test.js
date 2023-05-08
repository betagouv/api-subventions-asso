import * as ProviderValueHelper from "./providerValueHelper";

function buildProviderValue(value, providerName = "PROVIDER A", date = new Date()) {
    return {
        value: value,
        provider: providerName,
        last_update: date,
    };
}

describe("providerValueHelper", () => {
    const PROVIDER_VALUE = buildProviderValue("VALUE");
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    describe("flatenProviderValue", () => {
        describe("when given param is a ProviderValues", () => {
            const PROVIDER_VALUES = [
                buildProviderValue("A", "PROVIDER A", today),
                buildProviderValue("B", "PROVIDER A", yesterday),
            ];

            it("should return an array of value", () => {
                const expected = [PROVIDER_VALUES[0].value, PROVIDER_VALUES[1].value];
                const actual = ProviderValueHelper.flatenProviderValue(PROVIDER_VALUES);
                expect(actual).toEqual(expected);
            });
        });
    });

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
