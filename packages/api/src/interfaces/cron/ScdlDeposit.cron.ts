import { AsyncCron } from "../../decorators/cronController.decorator";
import { CronController } from "../../@types/cron";
import { scdlDepositCronService } from "../../init-services";

export class ScdlDepositCron implements CronController {
    name = "scdlDepositCron";

    // every day at 10pm
    @AsyncCron({ cronExpression: "0 22 * * *" })
    // notify users who have not completed their deposit process
    async notifyUsers() {
        return scdlDepositCronService.notifyUsers();
    }
    // every second day of each month (second just to avoid timezone problem)
    @AsyncCron({ cronExpression: "0 0 2 * *" })
    // notify users to renew their deposit one year later
    async notifyDepositRenewal() {
        return scdlDepositCronService.notifyDepositRenewal();
    }

    // every day at 10pm
    @AsyncCron({ cronExpression: "0 23 * * *" })
    // notify users who have not completed their deposit process
    async notifyTeam() {
        return scdlDepositCronService.notifyTeam();
    }
}
