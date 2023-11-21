import { CliStaticInterface } from "../../@types";
import { StaticImplements } from "../../decorators/staticImplements.decorator";
import CliController from "../../shared/CliController";

import parseUniteLegalService from "../../modules/providers/datagouv/historyUniteLegal/uniteLegalParse.service"
import uniteLegalNamesPort from "../../dataProviders/db/uniteLegalNames/uniteLegalNames.port";
import uniteLegalEntreprisePort from "../../dataProviders/db/uniteLegalEntreprise/uniteLegalEntreprise.port";

@StaticImplements<CliStaticInterface>()
export default class HistoryUniteLegalInterfaceCli extends CliController {
    static cmdName = "historyUniteLegal";

    protected logFileParsePath = "./logs/historyUniteLegal.parse.log.txt";

    protected async _parse(file: string, logs: unknown[], exportDate: Date) {
        return parseUniteLegalService.parse(file, exportDate, this.logger);
    }

    updateHistoryUniteLegal() {
        return parseUniteLegalService.updateHistoryUniteLegal();
    }

    async indexes() {
        await uniteLegalNamesPort.createIndexes();
        await uniteLegalEntreprisePort.createIndexes();
    }
}
