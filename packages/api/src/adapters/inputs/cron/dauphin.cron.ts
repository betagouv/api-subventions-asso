import { AsyncCron } from "../../../decorators/cron.decorator";
import { CronController } from "../../../@types/CronController";
import dauphinService from "../../../modules/providers/dauphin-gispro/dauphin.service";
import dataLogService from "../../../modules/data-log/dataLog.service";

export class DauphinCron implements CronController {
    name = "dauphinCron";

    // every day at 20PM
    @AsyncCron({ cronExpression: "0 20 * * *" })
    async updateDauphinCache() {
        await dauphinService.updateApplicationCache();
        await dataLogService.addFromApi({
            providerId: dauphinService.meta.id,
            providerName: dauphinService.meta.name,
            editionDate: new Date(),
        });
    }
}
