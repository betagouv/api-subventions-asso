import { AsyncCron } from "../../../decorators/cron.decorator";
import { CronController } from "../../../@types/CronController";
import { dumpService } from "../../../init-services";

export class DumpCron implements CronController {
    name = "dumpCron";

    // every Sunday at 00:00
    @AsyncCron({ cronExpression: "0 0 * * 0" })
    publishStatsData() {
        return dumpService.publishStatsData();
    }
}
