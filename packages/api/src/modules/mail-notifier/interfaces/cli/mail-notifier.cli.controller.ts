import { StaticImplements } from "../../../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../../../@types";
import mailNotifierService from "../../mail-notifier.service";

@StaticImplements<CliStaticInterface>()
export default class MailNotifierCliController {
    static cmdName = "mail";

    public async sendTest(email: string) {
        await mailNotifierService.sendTestMail(email);
    }
}
