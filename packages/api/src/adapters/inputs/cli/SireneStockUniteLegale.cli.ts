import { CliStaticInterface } from "../../../@types";
import { StaticImplements } from "../../../decorators/static-implements.decorator";
import CliController from "../../../shared/CliController";
import sireneStockUniteLegaleFileService from "../../../modules/providers/sirene/stock-unite-legale/sirene-stock-unite-legale.file.service";

@StaticImplements<CliStaticInterface>()
export default class SireneStockUniteLegaleCli extends CliController {
    static cmdName = "sirene";

    protected logFileParsePath = "./logs/sirene-stock-unite-legale.parse.log.txt";

    async import() {
        await sireneStockUniteLegaleFileService.getAndParse();
    }
}
