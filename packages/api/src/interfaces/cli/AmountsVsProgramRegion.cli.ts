import { CliStaticInterface } from "../../@types";
import { StaticImplements } from "../../decorators/staticImplements.decorator";
import amountsVsProgramRegionService from "../../modules/dataViz/amountsVsProgramRegion/amountsVsProgramRegion.service";
import CliController from "../../shared/CliController";

@StaticImplements<CliStaticInterface>()
export default class AmountsVsProgramRegionCli extends CliController {
    static cmdName = "amounts-vs-program-region";

    // should only be used once, then sync with resyncExercise
    async init() {
        if (await amountsVsProgramRegionService.isCollectionInitialized())
            throw new Error("DB already initialized, used resyncExercice instead");

        this.logger.logIC("Create all amounts vs program region collection");
        return amountsVsProgramRegionService.init();
    }

    resyncExercice(exerciceBudgetaire: number) {
        this.logger.logIC(`Resync amounts vs program region collection for exercice ${exerciceBudgetaire}`);
        return amountsVsProgramRegionService.updateCollection(exerciceBudgetaire);
    }
}
