import { scdlDepositCronService } from "../../configurations/di-container";

export default class DepositLogCli {
    static cmdName = "scdl-deposit";

    async notifyUsers() {
        console.log("start notifyUsers");
        await scdlDepositCronService.notifyUsers();
        console.log("end notifyUsers");
    }
}
