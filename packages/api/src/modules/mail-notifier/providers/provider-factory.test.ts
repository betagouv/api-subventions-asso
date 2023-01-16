import NodeMailerProvider from "./nodemailer.provider";
import ProviderFactory from "./provider-factory";
import SendInBlueProvider from "./sendinblue.provider";

describe("Mail Provider Factory", () => {
    describe("getProvider()", () => {
        it("should return SendInBlueProvider by default", () => {
            const expected = SendInBlueProvider.name;
            const provider = ProviderFactory.getProvider();
            const actual = provider.constructor.name;
            expect(actual).toEqual(expected);
        });
        it("should return SendInBlueProvider", () => {
            const expected = SendInBlueProvider.name;
            const provider = ProviderFactory.getProvider("SendInBlue");
            const actual = provider.constructor.name;
            expect(actual).toEqual(expected);
        });
        it("should return NodeMailerProvider", () => {
            const expected = NodeMailerProvider.name;
            const provider = ProviderFactory.getProvider("NodeMailer");
            const actual = provider.constructor.name;
            expect(actual).toEqual(expected);
        });
    });
});
