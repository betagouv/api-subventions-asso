import { AsyncCron } from "../../decorators/cronController.decorator";
import { CronController } from "../../@types/cron";
import userRgpdService from "../../modules/user/services/rgpd/user.rgpd.service";

export class RgpdCron implements CronController {
    name = "rgpdCron";

    // every day at 9 PM
    @AsyncCron({ cronExpression: "0 21 * * *" })
    asyncTest() {
        return userRgpdService.bulkDisableInactive();
    }
}
