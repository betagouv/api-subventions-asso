import { AsyncCron } from "../../../../decorators/cronController.decorator";
import { CronController } from "../../../../@types/cron";
import demarchesSimplifieesService from "../../../providers/demarchesSimplifiees/demarchesSimplifiees.service";

export class DemarchesSimplifieesCronController implements CronController {
    name = "demarchesSimplifieesCron";

    // every day at 5AM
    @AsyncCron({ cronExpression: "0 5 * * *" })
    updateAll() {
        return demarchesSimplifieesService.updateAllForms();
    }
}
