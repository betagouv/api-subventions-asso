import { StaticImplements } from "../../../../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../../../../@types";
import CliController from "../../../../../shared/CliController";
import ParseHistoryUniteeLegalUseCase from "../../use-cases/ParseHistoryUniteeLegalUseCase";
import UpdateHistoryUniteeLegalUseCase from "../../use-cases/UpdateHistoryUniteeLegalUseCase";

@StaticImplements<CliStaticInterface>()
export default class DataGouvCliController extends CliController {
    static cmdName = "datagouv";

    protected logFileParsePath = "./logs/datagouv.parse.log.txt";

    protected async _parse(file: string, logs: unknown[], exportDate: Date) {
        return ParseHistoryUniteeLegalUseCase(file, exportDate, this.logger);
    }

    updateHistoryUniteeLegal() {
        return UpdateHistoryUniteeLegalUseCase();
    }
}
