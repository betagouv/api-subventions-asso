import { StaticImplements } from "../../../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../../../@types";
import mailNotifierService from "../../mail-notifier.service";

// No tests because this is only for test purpose
@StaticImplements<CliStaticInterface>()
export default class MailNotifierCliController {
    static cmdName = "mail";

    // TODO: update the testing steps for SendInBlue template email
    public async sendTest(email: string, params = {}, templateId = 1) {
        await mailNotifierService.sendTestMail(email, params, templateId);
    }
}
