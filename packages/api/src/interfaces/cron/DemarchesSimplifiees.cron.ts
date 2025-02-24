import { AsyncCron } from "../../decorators/cronController.decorator";
import { CronController } from "../../@types/cron";
import demarchesSimplifieesService from "../../modules/providers/demarchesSimplifiees/demarchesSimplifiees.service";
import dataLogService from "../../modules/data-log/dataLog.service";

export class DemarchesSimplifieesCron implements CronController {
    name = "demarchesSimplifieesCron";

    // every day at 5AM
    @AsyncCron({ cronExpression: "0 5 * * *" })
    async updateAll() {
        await demarchesSimplifieesService.updateAllForms();
        await dataLogService.addLog(demarchesSimplifieesService.provider.id, "api", new Date());
    }
}
