import { AsyncCron } from "../../../decorators/cron.decorator";
import { CronController } from "../../../@types/CronController";
import demarchesSimplifieesService from "../../../modules/providers/demarches-simplifiees/demarches-simplifiees.service";
import dataLogService from "../../../modules/data-log/dataLog.service";

export class DemarchesSimplifieesCron implements CronController {
    name = "demarchesSimplifieesCron";

    // every day at 5AM
    @AsyncCron({ cronExpression: "0 5 * * *" })
    async updateAll() {
        await demarchesSimplifieesService.updateAllForms();
        await dataLogService.addFromApi({
            providerId: demarchesSimplifieesService.meta.id,
            providerName: demarchesSimplifieesService.meta.name,
            editionDate: new Date(),
        });
    }
}
