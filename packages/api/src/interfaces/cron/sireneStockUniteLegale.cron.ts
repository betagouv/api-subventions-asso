import { CronController } from "../../@types/cron";
import { AsyncCron } from "../../decorators/cronController.decorator";
import sireneStockUniteLegaleFileService
    from "../../modules/providers/sirene/stockUniteLegale/sireneStockUniteLegale.file.service";

export class SireneStockUniteLegaleCron implements CronController {
    name = "sireneStockUniteLegaleCron";

    // every month on day 2 (00:00)
    @AsyncCron({ cronExpression: "0 0 2 * *" })
    async getAndParse() {
        await sireneStockUniteLegaleFileService.getAndParse();
    }
}
