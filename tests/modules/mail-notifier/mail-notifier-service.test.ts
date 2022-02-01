import nodemailer from "nodemailer";
import { MAIL_USER } from "../../../src/configurations/mail.conf";

import mailNotifierService from "../../../src/modules/mail-notifier/mail-notifier.service"

describe("MailNotiferSerivce", () => {
    it("should send test mail", async () => {
        const transporter = nodemailer.createTransport();
        await mailNotifierService.sendTestMail("test@beta.gouv.fr");

        expect(transporter.sendMail).toHaveBeenCalledWith({
            from: `DataSubvention <${MAIL_USER}>`,
            to: "test@beta.gouv.fr",
            subject: "Envoie de mail test", 
            text:  `
            Data Subvention
            Ceci est un mail de test merci de ne pas en prendre compte

            Bonne journée, de la part de l'équipe DataSubvention !
        `,
            html: `<h1>Data Subvention</h1>
                <p>Ceci est un mail de test merci de ne pas en prendre compte.</p>

                <p>Bonne journée, de la part de l'équipe DataSubvention !</p>`
            , 
        });
    })
});