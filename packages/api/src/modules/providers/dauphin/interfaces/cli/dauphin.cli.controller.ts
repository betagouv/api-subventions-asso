import { CliStaticInterface } from "../../../../../@types";
import { StaticImplements } from "../../../../../decorators/staticImplements.decorator";
import { printAtSameLine } from "../../../../../shared/helpers/CliHelper";
import dauphinService from "../../dauphin.service";

@StaticImplements<CliStaticInterface>()
export default class DauphinCliController {
    static cmdName = "dauphin";

    async applyDauphinCacheToDauphinGisproMigration() {
        const logger = (message, sameLine) => {
            if (!sameLine) console.log(message);
            else printAtSameLine(message);
        };

        await dauphinService.migrateDauphinCacheToDauphinGispro(logger);
    }

    // only for test purpose
    async test(date = new Date()) {
        const midnight = new Date(date);
        midnight.setHours(0, 0, 0, 0);
        console.log(`fetching all dauphin applications since ${midnight}`);
        await dauphinService.fetchAndSaveApplicationsFromDate(midnight);
    }
}
