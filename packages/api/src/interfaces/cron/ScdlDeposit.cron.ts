import { AsyncCron } from "../../decorators/cronController.decorator";
import { CronController } from "../../@types/cron";
import scdlDespositCronService from "../../modules/deposit-scdl-process/scdl-deposit.cron.service";

export class ScdlDepositCron implements CronController {
    name = "scdlDepositCron";

    // every day at 10pm
    @AsyncCron({ cronExpression: "0 22 * * *" })
    // notify users who have not completed their deposit process
    async notifyUsers() {
        return scdlDespositCronService.notifyUsers();
    }

    // every day at 10pm
    @AsyncCron({ cronExpression: "0 23 * * *" })
    // notify users who have not completed their deposit process
    async notifyTeam() {
        return scdlDespositCronService.notifyTeam();
    }
}
