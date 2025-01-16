import { CliStaticInterface } from "../../@types";
import { StaticImplements } from "../../decorators/staticImplements.decorator";
import CliController from "../../shared/CliController";
import sireneStockUniteLegaleService from "../../modules/providers/sirene/stockUniteLegale/sireneStockUniteLegale.service";
import sireneStockUniteLegaleApiPort, { SireneStockUniteLegaleApiPort } from "../../dataProviders/api/sirene/sireneStockUniteLegale.port";
import { SireneStockUniteLegaleParser } from "../../modules/providers/sirene/stockUniteLegale/parser/sireneStockUniteLegale.parser";
import { dirname } from "path";

@StaticImplements<CliStaticInterface>()
export default class SireneStockUniteLegaleCli extends CliController {
    static cmdName = "sireneStockUniteLegale";

    protected logFileParsePath = "./logs/sireneStockUniteLegale.parse.log.txt";

    async parse() {
      //await sireneStockUniteLegaleService.getAndParse();
      await SireneStockUniteLegaleParser.parseCsvAndInsert("/home/gcarra/data_subvention/api-subventions-asso/packages/api/src/modules/providers/sirene/stockUniteLegale/tmpSirene/StockUniteLegale_utf8.csv");
    }

    
}