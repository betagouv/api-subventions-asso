import { TransactionalEmailsApi, SendSmtpEmail, TransactionalEmailsApiApiKeys } from "sib-api-v3-typescript";
import { LOG_MAIL, MAIL_USER } from "../../../configurations/mail.conf";
import { API_SENDINBLUE_TOKEN } from "../../../configurations/apis.conf";
import INotifier from "./@types/INotifier";
import { DefaultObject } from "../../../@types";

export default class SendInBlueProvider implements INotifier {
    private apiInstance: TransactionalEmailsApi;

    constructor() {
        this.apiInstance = new TransactionalEmailsApi();
        this.apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, API_SENDINBLUE_TOKEN as string);
    }

    async sendTestMail(email: string, params: DefaultObject, templateId: number) {
        return this.sendMail(email, params, templateId);
    }

    async sendCreationMail(email: string, params: DefaultObject) {
        return this.sendMail(email, params, 2);
    }

    async sendForgetPasswordMail(email: string, params: DefaultObject) {
        return this.sendMail(email, params, 3);
    }

    async sendMail(email: string, params: DefaultObject, templateId: number): Promise<boolean> {
        const sendSmtpEmail = new SendSmtpEmail();
        sendSmtpEmail.templateId = templateId;
        sendSmtpEmail.sender = { name: "Data.Subvention", email: MAIL_USER };
        sendSmtpEmail.params = params;
        sendSmtpEmail.to = [{ email: email }];
        sendSmtpEmail.bcc = [{ name: "Data.Subvention Log", email: LOG_MAIL }];

        try {
            await this.apiInstance.sendTransacEmail(sendSmtpEmail, {
                headers: {
                    "content-type": "application/json"
                }
            });
            return true;
        } catch (error) {
            return false;
        }
    }
}
