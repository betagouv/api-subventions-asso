import ProviderFactory from "./provider-factory";
import SendInBlueProvider from "./sendinblue.provider";

describe("Mail Provider Factory", () => {
    describe("getProvider()", () => {
        it("should return SendInBlueProvider", () => {
            const expected = SendInBlueProvider.name;
            const provider = ProviderFactory.getProvider();
            const actual = provider.constructor.name;
            expect(actual).toEqual(expected);
        });
    });
});
