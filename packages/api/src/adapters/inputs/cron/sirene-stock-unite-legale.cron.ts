import { CronController } from "../../../@types/CronController";
import { AsyncCron } from "../../../decorators/cron.decorator";
import sireneStockUniteLegaleFileService from "../../../modules/providers/sirene/stock-unite-legale/sirene-stock-unite-legale.file.service";

export class SireneStockUniteLegaleCron implements CronController {
    name = "sirene";

    // every month on day 2 (00:00)
    @AsyncCron({ cronExpression: "0 0 2 * *" })
    async import() {
        await sireneStockUniteLegaleFileService.getAndParse();
    }
}
