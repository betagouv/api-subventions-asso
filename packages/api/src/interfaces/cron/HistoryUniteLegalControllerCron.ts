import { CronController } from "../../@types/cron";
import { AsyncCron } from "../../decorators/cronController.decorator";
import parseUniteLegalService from "../../modules/providers/insee/historyUniteLegal/uniteLegal.parse.service";

export class HistoryUniteLegalInterfaceCron implements CronController {
    name = "HistoryUniteLegalCron";

    // every month on day 2 (00:00)
    @AsyncCron({ cronExpression: "0 0 2 * *" })
    async downloadAndParseHistoryUniteLegal() {
        await parseUniteLegalService.updateHistoryUniteLegal();
    }
}
