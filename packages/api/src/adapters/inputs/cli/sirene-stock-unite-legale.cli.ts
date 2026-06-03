import { CliStaticInterface } from "../../../@types";
import { StaticImplements } from "../../../decorators/static-implements.decorator";
import sireneStockUniteLegaleService from "../../../modules/providers/sirene/sirene-stock-unite-legale.service";
import CliController from "../../../shared/CliController";

@StaticImplements<CliStaticInterface>()
export default class SireneStockUniteLegaleCli extends CliController {
    static cmdName = "sirene";

    protected logFileParsePath = "./logs/sirene-stock-unite-legale.parse.log.txt";

    async import() {
        await sireneStockUniteLegaleService.getAndParse();
    }
}
