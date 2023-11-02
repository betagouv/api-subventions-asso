import { StaticImplements } from "../../../../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../../../../@types";
import CliController from "../../../../../shared/CliController";
import parseUniteLegalService from "../../parse.uniteLegal.service";

@StaticImplements<CliStaticInterface>()
export default class DataGouvCliController extends CliController {
    static cmdName = "datagouv";

    protected logFileParsePath = "./logs/datagouv.parse.log.txt";

    protected async _parse(file: string, logs: unknown[], exportDate: Date) {
        return parseUniteLegalService.parse(file, exportDate, this.logger);
    }

    updateHistoryUniteLegal() {
        return parseUniteLegalService.updateHistoryUniteLegal();
    }
}
