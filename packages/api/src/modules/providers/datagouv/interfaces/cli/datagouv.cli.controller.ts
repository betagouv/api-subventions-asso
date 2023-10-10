import { StaticImplements } from "../../../../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../../../../@types";
import CliController from "../../../../../shared/CliController";
import ParseHistoryUniteLegalUseCase from "../../use-cases/ParseHistoryUniteLegalUseCase";
import UpdateHistoryUniteLegalUseCase from "../../use-cases/UpdateHistoryUniteLegalUseCase";

@StaticImplements<CliStaticInterface>()
export default class DataGouvCliController extends CliController {
    static cmdName = "datagouv";

    protected logFileParsePath = "./logs/datagouv.parse.log.txt";

    protected async _parse(file: string, logs: unknown[], exportDate: Date) {
        return ParseHistoryUniteLegalUseCase.run(file, exportDate, this.logger);
    }

    updateHistoryUniteLegal() {
        return UpdateHistoryUniteLegalUseCase();
    }
}
