import { AsyncCron } from "../../../decorators/cron.decorator";
import { CronController } from "../../../@types/CronController";
import { metabaseDumpService, posthogDumpService } from "../../../init-services";

export class DumpCron implements CronController {
    name = "dumpCron";

    @AsyncCron({ cronExpression: "0 0 * * 0" })
    publishPosthogLogs() {
        return posthogDumpService.publishLogs();
    }

    // every Sunday at 00:00
    @AsyncCron({ cronExpression: "0 0 * * 0" })
    publishStatsData() {
        return metabaseDumpService.publishStatsData();
    }
}
