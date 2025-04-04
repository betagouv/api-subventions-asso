import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";
import applicationsFlatService from "../../modules/applicationFlat/applicationFlat.service";
import CliController from "../../shared/CliController";

@StaticImplements<CliStaticInterface>()
export default class ApplicationFlatCli extends CliController {
    static cmdName = "application-flat";

    async resyncExercice(exerciceBudgetaire: number) {
        // to ensure that scalingo console does not close
        const ticTacInterval = setInterval(() => console.log("TIC"), 60000);
        if (!exerciceBudgetaire) throw new Error("Argument 'exercice budgetaire' is required");

        this.logger.logIC(`Resync application flat collection for exercice ${exerciceBudgetaire}`);
        await applicationsFlatService.updateApplicationsFlatCollection(exerciceBudgetaire);
        clearInterval(ticTacInterval);
    }

    // should only be used once, then sync with resyncExercise
    async init() {
        if (await applicationsFlatService.isCollectionInitialized())
            throw new Error("DB already initialized, use resyncExercice instead");

        this.logger.logIC("Create all application flat collection");
        const ticTacInterval = setInterval(() => console.log("TIC"), 60000);
        await applicationsFlatService.updateApplicationsFlatCollection();
        clearInterval(ticTacInterval);
    }
}
