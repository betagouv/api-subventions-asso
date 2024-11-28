import { AsyncCron } from "../../decorators/cronController.decorator";
import { CronController } from "../../@types/cron";
import userStatsService from "../../modules/user/services/stats/user.stats.service";

export class StatsCron implements CronController {
    name = "stats";

    // every day at 20PM
    @AsyncCron({ cronExpression: "0 22 * * *" })
    updateUserNbRequests() {
        return userStatsService.updateNbRequests();
        // TODO also update to brevo #1900
    }
}
