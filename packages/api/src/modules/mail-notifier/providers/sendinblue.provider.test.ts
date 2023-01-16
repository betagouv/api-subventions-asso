import SendInBlueProvider from "./sendinblue.provider";
import { TransactionalEmailsApi } from "sib-api-v3-typescript";

jest.mock("sib-api-v3-typescript");

describe("sendinblue.provider", () => {
    let spySendTransacEmail = jest.spyOn(TransactionalEmailsApi.prototype, "sendTransacEmail");

    describe("sendMail()", () => {
        const EMAIL = "EMAIL";
        const SUBJECT = "SUBJECT";
        const HTML = "HTML";
        const TEXT = "TEXT";
        it("should mock", async () => {
            const provider = new SendInBlueProvider();
            const expected = [
                {
                    bcc: [
                        {
                            email: "log@datasubvention.beta.gouv.fr",
                            name: "Data.Subvention Log"
                        }
                    ],
                    htmlContent: HTML,
                    textContent: TEXT,
                    sender: { email: process.env.MAIL_USER, name: "Data.Subvention" },
                    subject: SUBJECT,
                    to: [{ email: EMAIL }]
                }
            ];
            await provider.sendMail("EMAIL", "SUBJECT", "HTML", "TEXT");
            const actual = spySendTransacEmail.mock.calls[0];
            expect(actual).toEqual(expected);
        });
    });
});
