import { AsyncCron } from "../../../../decorators/cronController.decorator";
import { CronController } from "../../../../@types/cron";
import dumpService from "../../dump.service";

export class DumpCronController implements CronController {
    name = "dumpCron";

    // every day at 20PM
    @AsyncCron({ cronExpression: "0 20 * * *" })
    publishStatsData() {
        return dumpService.publishStatsData();
    }
}
