import { BrevoMailNotifyPipe, TemplateEnum } from "./BrevoMailNotifyPipe";
import * as Brevo from "@getbrevo/brevo";

jest.mock("@getbrevo/brevo", () => ({
    TransactionalEmailsApi: jest.fn(() => ({ setApiKey: jest.fn() })),
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
    // @ts-expect-error: partial mock of class
    jest.mocked(Brevo.TransactionalEmailsApi).mockImplementation(() => ({
        sendTransacEmail: mockSendTransacEmail,
        setApiKey: jest.fn(),
    }));
    let provider: BrevoMailNotifyPipe;
    const EMAIL = "EMAIL";

    beforeEach(() => {
        provider = new BrevoMailNotifyPipe();
    });

    describe("BrevoMailNotifyPipe custom template methods", () => {
        beforeEach(() => (provider.sendMail = mockSendMail));

        it.each`
            method                      | templateId
            ${"sendCreationMail"}       | ${TemplateEnum.creation}
            ${"sendForgetPasswordMail"} | ${TemplateEnum.forgetPassword}
            ${"greetActivated"}         | ${TemplateEnum.activated}
        `("should call sendMail with templateId", async ({ method, templateId }) => {
            const expected = [EMAIL, expect.any(Object), templateId];
            await provider[method]({ email: EMAIL });
            expect(mockSendMail).toHaveBeenCalledWith(...expected);
        });

        it("should call sendMail with templateId", async () => {
            const expected = [EMAIL, expect.any(Object), TemplateEnum.creationAgentConnect];
            // @ts-expect-error -- test private
            await provider.sendCreationMail({ email: EMAIL, isAgentConnect: true });
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
