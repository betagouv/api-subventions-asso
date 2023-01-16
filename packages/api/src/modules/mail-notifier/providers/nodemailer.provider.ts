import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { LOG_MAIL, MAIL_HOST, MAIL_PASSWORD, MAIL_PORT, MAIL_USER } from "../../../configurations/mail.conf";
import INotifier from "./@types/INotifier";

export default class NodeMailerProvider implements INotifier {
    transport = nodemailer.createTransport({
        host: MAIL_HOST,
        port: MAIL_PORT,
        requireTLS: true,
        auth: {
            user: MAIL_USER,
            pass: MAIL_PASSWORD
        }
    } as unknown as SMTPTransport.Options);

    async sendMail(email: string, subject: string, html: string, text: string): Promise<boolean> {
        try {
            await this.transport.verify();
        } catch (e) {
            console.error(e);
            return false;
        }
        const message = {
            from: `DataSubvention <${MAIL_USER}>`,
            to: email,
            bcc: LOG_MAIL,
            subject: subject,
            text: text,
            html: html
        };

        await this.transport.sendMail(message);

        return true;
    }
}
