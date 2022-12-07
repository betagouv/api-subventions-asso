import ProviderValueAdapter from "./ProviderValueAdapter";

describe("ProviderValueAdapter", () => {
    const PROVIDER_VALUES = [{ value: "foo", provider: "bar", last_update: new Date(), type: "string" }];
    describe("isProviderValues", () => {
        // it("should work")
        it.each`
            value              | expected
            ${undefined}       | ${false}
            ${null}            | ${false}
            ${[]}              | ${false}
            ${PROVIDER_VALUES} | ${true}
        `("should return is ProviderValues", ({ value, expected }) => {
            const actual = ProviderValueAdapter.isProviderValues(value);
            expect(actual).toBe(expected);
        });
    });
});
