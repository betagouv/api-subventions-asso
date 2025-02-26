import { CliStaticInterface } from "../../@types";
import { StaticImplements } from "../../decorators/staticImplements.decorator";
import CliController from "../../shared/CliController";
import sireneStockUniteLegaleService from "../../modules/providers/sirene/stockUniteLegale/sireneStockUniteLegale.service";

@StaticImplements<CliStaticInterface>()
export default class SireneStockUniteLegaleCli extends CliController {
    static cmdName = "sireneStockUniteLegale";

    protected logFileParsePath = "./logs/sireneStockUniteLegale.parse.log.txt";

    async getAndParse() {
        await sireneStockUniteLegaleService.getAndParse();
    }
}
