import INotifier from "./@types/INotifier";
import { TransactionalEmailsApi, SendSmtpEmail, TransactionalEmailsApiApiKeys } from 'sib-api-v3-typescript';
import { LOG_MAIL, MAIL_USER } from "../../../configurations/mail.conf";
import { API_SENDINBLUE_TOKEN } from "../../../configurations/apis.conf"


export default class SendInBlueProvider implements INotifier {
    private apiInstance: TransactionalEmailsApi;

    constructor() {
        this.apiInstance = new TransactionalEmailsApi();

        this.apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, API_SENDINBLUE_TOKEN as string);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async sendMail(email: string, subject: string, html: string, text: string): Promise<boolean> {
        const sendSmtpEmail = new SendSmtpEmail();
        sendSmtpEmail.subject = subject;
        sendSmtpEmail.htmlContent = html;
        sendSmtpEmail.textContent = text;
        sendSmtpEmail.sender = { "name": "Data.Subvention", "email": MAIL_USER };
        sendSmtpEmail.to = [{ "email": email }];
        sendSmtpEmail.bcc = [{ "name": "Data.Subvention Log", "email": LOG_MAIL }];

        try {
            await this.apiInstance.sendTransacEmail(sendSmtpEmail);
            return true
        } catch (error) {
            return false
        }
    }
}