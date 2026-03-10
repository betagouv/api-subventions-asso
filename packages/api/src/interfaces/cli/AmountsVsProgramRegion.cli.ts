import { CliStaticInterface } from "../../@types";
import { StaticImplements } from "../../decorators/staticImplements.decorator";
import CliController from "../../shared/CliController";
import { amountsVsProgramRegionService } from "../../init-services/init-amount-vs-program-region-services";

@StaticImplements<CliStaticInterface>()
export default class AmountsVsProgramRegionCli extends CliController {
    static cmdName = "amounts-vs-program-region";

    // should only be used once, then sync with resyncExercise
    async init() {
        if (await amountsVsProgramRegionService.isCollectionInitialized())
            throw new Error("DB already initialized, use resyncExercice instead");

        this.logger.logIC("Create all amounts vs program region collection");
        return amountsVsProgramRegionService.init();
    }

    resyncExercice(exerciceBudgetaireStr: string) {
        const exerciceBudgetaire = parseInt(exerciceBudgetaireStr);
        this.logger.logIC(`Resync amounts vs program region collection for exercice ${exerciceBudgetaire}`);
        return amountsVsProgramRegionService.updateCollection(exerciceBudgetaire);
    }
}
