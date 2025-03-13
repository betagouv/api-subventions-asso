import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";

import paymentsFlatService from "../../modules/paymentFlat/paymentFlat.service";
import CliController from "../../shared/CliController";

@StaticImplements<CliStaticInterface>()
export default class PaymentFlatCli extends CliController {
    static cmdName = "payment-flat";

    async resyncExercice(exerciceBudgetaire: number) {
        const ticTacInterval = setInterval(() => console.log("TIC"), 60000);
        if (!exerciceBudgetaire) throw new Error("Exercice budgetaire is required");

        this.logger.logIC(`Resync payment flat collection for exercice ${exerciceBudgetaire}`);
        await paymentsFlatService.updatePaymentsFlatCollection(exerciceBudgetaire);
        clearInterval(ticTacInterval);
    }

    // should only be used once, then sync with resyncExercise
    async init() {
        const ticTacInterval = setInterval(() => console.log("TIC"), 60000);
        if (await paymentsFlatService.isCollectionInitialized())
            throw new Error("DB already initialized, used resyncExercice instead");

        this.logger.logIC("Create all payment flat collection");
        await paymentsFlatService.init();
        clearInterval(ticTacInterval);
    }
}
