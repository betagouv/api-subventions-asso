import { CliStaticInterface } from "../../@types";
import { StaticImplements } from "../../decorators/staticImplements.decorator";
import CliController from "../../shared/CliController";

import parseUniteLegalService from "../../modules/providers/datagouv/historyUniteLegal/uniteLegal.parse.service";

@StaticImplements<CliStaticInterface>()
export default class HistoryUniteLegalCli extends CliController {
    static cmdName = "historyUniteLegal";

    protected logFileParsePath = "./logs/historyUniteLegal.parse.log.txt";

    protected async _parse(file: string, logs: unknown[], exportDate: Date) {
        return parseUniteLegalService.parse(file, exportDate, this.logger);
    }

    updateHistoryUniteLegal() {
        return parseUniteLegalService.updateHistoryUniteLegal();
    }
}
