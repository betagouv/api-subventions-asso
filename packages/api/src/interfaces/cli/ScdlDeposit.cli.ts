import { scdlDepositCronService } from "../../init-services/init-deposit-scdl-services";

export default class DepositLogCli {
    static cmdName = "scdl-deposit";

    async notifyUsers() {
        console.log("start notifyUsers");
        await scdlDepositCronService.notifyUsers();
        console.log("end notifyUsers");
    }
}
