import { CronController } from "../../../@types/CronController";
import { AsyncCron } from "../../../decorators/cron.decorator";
import sireneStockUniteLegaleFileService from "../../../modules/providers/sirene/sirene-stock-unite-legale.service";
import sireneStockEstablishmentService from "../../../modules/providers/sirene/sirene-stock-establishment.service";

export class SireneStockCron implements CronController {
    name = "sirene";

    // every month on day 2 (00:00)
    @AsyncCron({ cronExpression: "0 0 2 * *" })
    async import() {
        await sireneStockUniteLegaleFileService.getAndParse();
        await sireneStockEstablishmentService.getAndParse();
    }
}
