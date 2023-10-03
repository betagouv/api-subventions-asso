import { AsyncCron } from "../../../../../decorators/cronController.decorator";
import { CronController } from "../../../../../@types/cron";
import UpdateHistoryUniteeLegalUseCase from "../../use-cases/UpdateHistoryUniteeLegalUseCase";

export class DataGouvCronController implements CronController {
    name = "DataGouvCron";

    // every month on day 2 (00:00)
    @AsyncCron({ cronExpression: "0 0 2 * *" })
    async downloadAndParseHistoryUniteeLegal() {
        await UpdateHistoryUniteeLegalUseCase();
    }
}
