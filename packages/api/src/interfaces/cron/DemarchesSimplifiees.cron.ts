import { AsyncCron } from "../../decorators/cronController.decorator";
import { CronController } from "../../@types/cron";
import demarchesSimplifieesService from "../../modules/providers/demarchesSimplifiees/demarchesSimplifiees.service";

export class DemarchesSimplifieesCron implements CronController {
    name = "demarchesSimplifieesCron";

    // every day at 5AM
    @AsyncCron({ cronExpression: "0 5 * * *" })
    updateAll() {
        return demarchesSimplifieesService.updateAllForms();
    }
}
