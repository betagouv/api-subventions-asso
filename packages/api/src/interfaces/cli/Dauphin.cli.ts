import { CliStaticInterface } from "../../@types";
import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { printAtSameLine } from "../../shared/helpers/CliHelper";
import dauphinService from "../../modules/providers/dauphin/dauphin.service";

@StaticImplements<CliStaticInterface>()
export default class DauphinCli {
    static cmdName = "dauphin";

    async applyDauphinCacheToDauphinGisproMigration() {
        const logger = (message, sameLine) => {
            if (!sameLine) console.log(message);
            else printAtSameLine(message);
        };

        await dauphinService.migrateDauphinCacheToDauphinGispro(logger);
    }

    async updateCache() {
        await dauphinService.updateApplicationCache();
    }
}
