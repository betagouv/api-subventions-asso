import scdlDespositCronService from "../../modules/deposit-scdl-process/scdl-deposit.cron.service";

export default class DepositLogCli {
    static cmdName = "scdl-deposit";

    async notifyUsers() {
        console.log("start notifyUsers");
        await scdlDespositCronService.notifyUsers();
        console.log("end notifyUsers");
    }
}
