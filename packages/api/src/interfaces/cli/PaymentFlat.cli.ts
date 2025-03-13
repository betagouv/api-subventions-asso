import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";

import paymentsFlatService from "../../modules/paymentFlat/paymentFlat.service";
import CliController from "../../shared/CliController";

@StaticImplements<CliStaticInterface>()
export default class PaymentFlatCli extends CliController {
    static cmdName = "payment-flat";

    resyncExercice(exerciceBudgetaire: number) {
        if (!exerciceBudgetaire) throw new Error("Exercice budgetaire is required");

        this.logger.logIC(`Resync payment flat collection for exercice ${exerciceBudgetaire}`);
        return paymentsFlatService.updatePaymentsFlatCollection(exerciceBudgetaire);
    }

    // should only be used once, then sync with resyncExercise
    async init() {
        if (await paymentsFlatService.isCollectionInitialized())
            throw new Error("DB already initialized, used resyncExercice instead");
        const START_YEAR = 2017;
        const END_YEAR = new Date().getFullYear();
        for (let year = START_YEAR; year <= END_YEAR; year++) {
            this.logger.logIC(`init payment flat collection for exercice ${year}`);
            await paymentsFlatService.updatePaymentsFlatCollection(year);
        }

        // this.logger.logIC("Create all payment flat collection");
        // return paymentsFlatService.init();
    }
}
