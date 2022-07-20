import INotifier from "./@types/INotifier";
import { TransactionalEmailsApi, SendSmtpEmail, TransactionalEmailsApiApiKeys } from 'sib-api-v3-typescript';
import { LOG_MAIL, MAIL_USER } from "../../../configurations/mail.conf";
import { API_SENDINBLUE_TOKEN } from "../../../configurations/apis.conf"

const apiInstance = new TransactionalEmailsApi();

apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, API_SENDINBLUE_TOKEN as string);

const sendSmtpEmail = new SendSmtpEmail();

export default class SendInBlueProvider implements INotifier {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async sendMail(email: string, subject: string, html: string, text: string): Promise<boolean> {
        sendSmtpEmail.subject = subject;
        sendSmtpEmail.htmlContent = html;
        sendSmtpEmail.sender = { "name": "Data.Subvention", "email": MAIL_USER };
        sendSmtpEmail.to = [{ "email": email }];
        sendSmtpEmail.bcc = [{ "name": "Data.Subvention Log", "email": LOG_MAIL }];

        try {
            await apiInstance.sendTransacEmail(sendSmtpEmail);
            return true
        } catch (error) {
            return false
        }
    }
}