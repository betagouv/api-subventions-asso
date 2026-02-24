import { AsyncCron } from "../../decorators/cronController.decorator";
import { CronController } from "../../@types/cron";
import { scdlDepositCronService } from "../../configurations/di-container";

export class ScdlDepositCron implements CronController {
    name = "scdlDepositCron";

    // every day at 10pm
    @AsyncCron({ cronExpression: "0 22 * * *" })
    // notify users who have not completed their deposit process
    async notifyUsers() {
        return scdlDepositCronService.notifyUsers();
    }

    // every day at 10pm
    @AsyncCron({ cronExpression: "0 23 * * *" })
    // notify users who have not completed their deposit process
    async notifyTeam() {
        return scdlDepositCronService.notifyTeam();
    }
}
