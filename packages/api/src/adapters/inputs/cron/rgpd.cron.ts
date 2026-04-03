import { AsyncCron } from "../../../decorators/cron.decorator";
import { CronController } from "../../../@types/CronController";
import userRgpdService from "../../../modules/user/services/rgpd/user.rgpd.service";

export class RgpdCron implements CronController {
    name = "rgpdCron";

    // every day at 9 PM
    @AsyncCron({ cronExpression: "0 21 * * *" })
    removeInactiveUsers() {
        return userRgpdService.bulkDisableInactive();
    }

    // every day at 9 PM
    @AsyncCron({ cronExpression: "0 21 * * *" })
    warnInactiveUsers() {
        return userRgpdService.warnDisableInactive();
    }
}
