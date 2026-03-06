import { scdlDepositCronService } from "../../init-services";

export default class DepositLogCli {
    static cmdName = "scdl-deposit";

    async notifyUsers() {
        console.log("start notifyUsers");
        await scdlDepositCronService.notifyUsers();
        console.log("end notifyUsers");
    }
}
