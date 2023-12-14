import { AsyncCron } from "../../decorators/cronController.decorator";
import { CronController } from "../../@types/cron";
import dauphinService from "../../modules/providers/dauphin/dauphin.service";

export class DauphinCron implements CronController {
    name = "dauphinCron";

    // every day at 20PM
    @AsyncCron({ cronExpression: "0 20 * * *" })
    updateDauphinCache() {
        return dauphinService.updateApplicationCache();
    }
}
