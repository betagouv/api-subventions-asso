import { CliStaticInterface } from "../../@types";
import { StaticImplements } from "../../decorators/staticImplements.decorator";
import CliController from "../../shared/CliController";
import stockEtabParseService from "../../modules/providers/insee/stockEtab/stockEtab.parse.service";

@StaticImplements<CliStaticInterface>()
export default class StockEtabInterfaceCli extends CliController {
    static cmdName = "stockEtab";

    protected logFileParsePath = "./logs/stockEtab.parse.log.txt";

    protected async _parse(file: string, logs: unknown[], exportDate: Date) {
        return stockEtabParseService.parse(file, exportDate, this.logger);
    }

    updateHistoryUniteLegal() {
        return stockEtabParseService.updateEstablishments();
    }
}
