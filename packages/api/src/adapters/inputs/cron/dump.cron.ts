import { AsyncCron } from "../../../decorators/cron.decorator";
import { CronController } from "../../../@types/CronController";
import { metabaseDumpService } from "../../../init-services";
import type AsyncUseCase from "../../../@types/use-case/AsyncUseCase";
import publishLogs from "../../../usecases/posthog/publish-logs";

export class DumpCron implements CronController {
    name = "dumpCron";

    constructor(private publishLogs: AsyncUseCase<void, void>) {
        AsyncCron({ cronExpression: "0 0 * * 0" })(this, "publishPosthogLogs", {
            value: () => this.publishPosthogLogs(),
        });
        AsyncCron({ cronExpression: "0 0 * * 0" })(this, "publishStatsData", {
            value: () => this.publishStatsData(),
        });
    }

    publishPosthogLogs() {
        return this.publishLogs.execute();
    }

    // every Sunday at 00:00
    publishStatsData() {
        return metabaseDumpService.publishStatsData();
    }
}

export default new DumpCron(publishLogs);
