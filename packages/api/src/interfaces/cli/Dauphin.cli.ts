import { CliStaticInterface } from "../../@types";
import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { printAtSameLine } from "../../shared/helpers/CliHelper";
import dauphinService from "../../modules/providers/dauphin-gispro/dauphin.service";
import dauphinFlatService from "../../modules/providers/dauphin-gispro/dauphin.flat.service";
import dauphinPort from "../../dataProviders/db/providers/dauphin/dauphin.port";

@StaticImplements<CliStaticInterface>()
export default class DauphinCli {
    static cmdName = "dauphin";

    async applyDauphinCacheToDauphinGisproMigration() {
        const logger = (message, sameLine) => {
            if (!sameLine) console.log(message);
            else printAtSameLine(message);
        };

        await dauphinService.migrateDauphinCacheToDauphin(logger);
    }

    async updateCache() {
        await dauphinService.updateApplicationCache();
    }

    initApplicationFlat() {
        return dauphinFlatService.feedApplicationFlat();
    }

    async prepareFlat() {
        await dauphinFlatService.generateTempJoinedCollection();
        console.log("dauphin simplified collection created");
    }

    async testStep1() {
        await dauphinPort.joinGisproStep1();
        console.log("step 1 done");
    }

    async testStep2() {
        await dauphinPort.joinGisproStep2();
        console.log("step 2 done");
    }
}
