import { CronController } from "../../@types/cron";
import { AsyncCron } from "../../decorators/cronController.decorator";
import dataBretagneService from "../../modules/providers/dataBretagne/dataBretagne.service";
import dataLogService from "../../modules/data-log/dataLog.service";

export class DataBretagneCron implements CronController {
    name = "DataBretagneCron";

    // every month on day 3 (00:00)
    @AsyncCron({ cronExpression: "0 0 3 * *" })
    async resync() {
        await dataBretagneService.resyncPrograms();
        await dataLogService.addLog(dataBretagneService.provider.id, new Date(new Date().getFullYear()), "api");
    }
}
