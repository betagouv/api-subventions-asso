import { AsyncCron } from "../../decorators/cron.decorator";
import { CronController } from "../../@types/CronController";
import userStatsService from "../../modules/user/services/stats/user.stats.service";

export class StatsCron implements CronController {
    name = "stats";

    // every day at 20PM
    @AsyncCron({ cronExpression: "0 22 * * *" })
    updateUserNbRequests() {
        return userStatsService.updateNbRequests();
    }
}
