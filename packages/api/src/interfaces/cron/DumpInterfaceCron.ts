import { AsyncCron } from "../../decorators/cronController.decorator";
import { CronController } from "../../@types/cron";
import dumpService from "../../modules/dump/dump.service";

export class DumpInterfaceCron implements CronController {
    name = "dumpCron";

    // every Sunday at 00:00
    @AsyncCron({ cronExpression: "0 0 * * 0" })
    publishStatsData() {
        return dumpService.publishStatsData();
    }
}
