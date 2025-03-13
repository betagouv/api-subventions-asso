import { CliStaticInterface } from "../../@types";
import { StaticImplements } from "../../decorators/staticImplements.decorator";
import CliController from "../../shared/CliController";
import sireneStockUniteLegaleFileService from "../../modules/providers/sirene/stockUniteLegale/sireneStockUniteLegale.file.service";

@StaticImplements<CliStaticInterface>()
export default class SireneStockUniteLegaleCli extends CliController {
    static cmdName = "sireneStockUniteLegale";

    protected logFileParsePath = "./logs/sireneStockUniteLegale.parse.log.txt";

    async getAndParse() {
        await sireneStockUniteLegaleFileService.getAndParse();
    }
}
