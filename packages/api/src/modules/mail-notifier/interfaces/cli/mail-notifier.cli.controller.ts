import { StaticImplements } from "../../../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../../../@types";
import mailNotifierService from "../../mail-notifier.service";

// No tests because this is only for test purpose
@StaticImplements<CliStaticInterface>()
export default class MailNotifierCliController {
    static cmdName = "mail";

    public async sendTest(email: string, params = {}, templateId = 1) {
        await mailNotifierService.sendTestMail(email, params, templateId);
    }
}
