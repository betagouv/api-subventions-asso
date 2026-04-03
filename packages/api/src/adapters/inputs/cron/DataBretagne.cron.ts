import { CronController } from "../../../@types/CronController";
import { AsyncCron } from "../../../decorators/cron.decorator";
import dataBretagneService from "../../../modules/providers/data-bretagne/data-bretagne.service";

export class DataBretagneCron implements CronController {
    name = "DataBretagneCron";

    // every month on day 3 (00:00)
    @AsyncCron({ cronExpression: "0 0 3 * *" })
    async resync() {
        await dataBretagneService.resyncPrograms();
    }
}
