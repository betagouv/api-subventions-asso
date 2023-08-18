import { BrevoMailNotifyPipe, TemplateEnum } from "./BrevoMailNotifyPipe";
import { TransactionalEmailsApi } from "@getbrevo/brevo";

jest.mock("sib-api-v3-typescript");

describe("BrevoMailNotify", () => {
    const spySendTransacEmail = jest.spyOn(TransactionalEmailsApi.prototype, "sendTransacEmail");
    const mockSendMail = jest.fn();
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
            const provider = new BrevoMailNotifyPipe();
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

            expect(spySendTransacEmail).toHaveBeenCalledWith(expected, {
                headers: {
                    "content-type": "application/json",
                },
            });
        });
    });
});
