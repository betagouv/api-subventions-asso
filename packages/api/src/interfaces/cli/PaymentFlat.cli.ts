import { StaticImplements } from "../../decorators/staticImplements.decorator";
import paymentFlatChorusService from "../../modules/paymentFlat/paymentFlat.chorus.service";
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
        await paymentFlatChorusService.updatePaymentsFlatCollection(exerciceBudgetaire);
        clearInterval(ticTacInterval);
    }

    // should only be used once, then sync with resyncExercise
    async initChorus() {
        if (await paymentsFlatService.isCollectionInitialized())
            throw new Error("DB already initialized, use resyncExercice instead");

        this.logger.logIC("Create all payment flat collection");
        const ticTacInterval = setInterval(() => console.log("TIC"), 60000);
        await paymentFlatChorusService.init();
        clearInterval(ticTacInterval);
    }
}
