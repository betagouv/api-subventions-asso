import { AsyncCron } from "../../decorators/cronController.decorator";
import { CronController } from "../../@types/cron";
import dauphinService from "../../modules/providers/dauphin-gispro/dauphin.service";
import dataLogService from "../../modules/data-log/dataLog.service";

export class DauphinCron implements CronController {
    name = "dauphinCron";

    // every day at 20PM
    @AsyncCron({ cronExpression: "0 20 * * *" })
    async updateDauphinCache() {
        await dauphinService.updateApplicationCache();
        await dataLogService.addLog(dauphinService.provider.id, "api", new Date());
    }
}
