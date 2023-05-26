import { AsyncCron } from "../../../../../decorators/cronController.decorator";
import { CronController } from "../../../../../@types/cron";
import dauphinService from "../../dauphin.service";

export class DauphinCronController implements CronController {
    name = "dauphinCron";

    // every day at 20PM
    @AsyncCron({ cronExpression: "0 20 * * *" })
    updateDauphinCache() {
        return dauphinService.updateApplicationCache();
    }
}
