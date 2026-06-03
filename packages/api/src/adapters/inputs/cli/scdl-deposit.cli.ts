import { scdlDepositCronService } from "../../../init-services";
import SendDepositRenewalNotificationUseCase from "../../../modules/deposit-scdl-process/send-deposit-renewal-notification.use-case";
import dataLogAdapter from "../../outputs/db/data-log/data-log.adapter";
import userAdapter from "../../outputs/db/user/user.adapter";

export default class DepositLogCli {
    static cmdName = "scdl-deposit";

    async notifyUsers() {
        console.log("start notifyUsers");
        await scdlDepositCronService.notifyUsers();
        console.log("end notifyUsers");
    }

    async notifyRenewal() {
        await new SendDepositRenewalNotificationUseCase(dataLogAdapter, userAdapter).execute();
    }
}
