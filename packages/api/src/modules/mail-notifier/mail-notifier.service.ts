import { DefaultObject } from "../../@types";
import { FRONT_OFFICE_URL } from "../../configurations/front.conf";
import ProviderFactory from "./providers/provider-factory";

export class MailNotifierService {
    private provider = ProviderFactory.getProvider();

    // couplage fort à SendInBlue mais c'est pour du test plus tard
    public async sendTestMail(email: string, params: DefaultObject, templateId: number) {
        await this.provider.sendTestMail(email, params, templateId);
    }

    public async sendCreationMail(email: string, token: string) {
        await this.provider.sendCreationMail(email, {
            url: `${FRONT_OFFICE_URL}/auth/reset-password/${token}?active=true`,
        });
    }

    public async sendForgetPasswordMail(email: string, token: string) {
        await this.provider.sendForgetPasswordMail(email, { url: `${FRONT_OFFICE_URL}/auth/reset-password/${token}` });
    }
}

const mailNotifierService = new MailNotifierService();

export default mailNotifierService;
