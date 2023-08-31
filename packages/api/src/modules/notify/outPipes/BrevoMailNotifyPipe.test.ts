import { BrevoMailNotifyPipe, TemplateEnum } from "./BrevoMailNotifyPipe";
import Brevo from "@getbrevo/brevo";

jest.mock("@getbrevo/brevo", () => ({
    TransactionalEmailsApi: jest.fn(),
    SendSmtpEmail: jest.fn(() => ({ templateId: undefined })),
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

describe("BrevoMailNotify", () => {
    const mockSendMail = jest.fn();
    const mockSendTransacEmail = jest.fn();
    Brevo.TransactionalEmailsApi.mockImplementation(() => ({ sendTransacEmail: mockSendTransacEmail }));
    let provider: BrevoMailNotifyPipe;
    const EMAIL = "EMAIL";

    beforeEach(() => {
        provider = new BrevoMailNotifyPipe();
    });

    describe.each`
        method                      | templateId
        ${"sendCreationMail"}       | ${TemplateEnum.creation}
        ${"sendForgetPasswordMail"} | ${TemplateEnum.forgetPassword}
    `("BrevoMailNotifyPipe custom template methods", ({ method, templateId }) => {
        beforeEach(() => (provider.sendMail = mockSendMail));

        it("should call sendMail with templateId", async () => {
            const expected = [EMAIL, {}, templateId];
            await provider[method]({ email: EMAIL });
            expect(mockSendMail).toHaveBeenCalledWith(...expected);
        });
    });

    describe("sendMail()", () => {
        const PARAMS = { foo: "bar" };
        const TEMPLATE_ID = 1;

        it("should call sendTransactionalEmail with params", async () => {
            const expected = {
                templateId: TEMPLATE_ID,
                sender: { email: process.env.MAIL_USER, name: "Data.Subvention" },
                params: PARAMS,
                bcc: [
                    {
                        email: "log@datasubvention.beta.gouv.fr",
                        name: "Data.Subvention Log",
                    },
                ],
                to: [{ email: EMAIL }],
            };
            await provider.sendMail(EMAIL, PARAMS, TEMPLATE_ID);

            expect(mockSendTransacEmail).toHaveBeenCalledWith(expected, {
                headers: {
                    "content-type": "application/json",
                },
            });
        });
    });
});
