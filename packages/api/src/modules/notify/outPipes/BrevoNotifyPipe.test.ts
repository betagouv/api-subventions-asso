import BrevoNotifyPipe from "./BrevoNotifyPipe";
import Brevo from "@getbrevo/brevo";

jest.mock("@getbrevo/brevo", () => ({
    ApiClient: {
        instance: {
            authentications: {
                "api-key": {
                    apiKey: undefined,
                },
            },
        },
    },
}));

describe("BrevoNotifyPipe", () => {
    describe("initBrevo()", () => {
        it("should define authentication token", () => {
            new BrevoNotifyPipe();
            expect(Brevo.ApiClient.instance.authentications["api-key"]).toBeDefined();
        });
    });
});
