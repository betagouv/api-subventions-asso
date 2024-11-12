import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";

import paymentsFlatService from "../../modules/data-viz/paymentFlat/paymentFlat.service";
import CliController from "../../shared/CliController";

@StaticImplements<CliStaticInterface>()
export default class PaymentsFlatCli extends CliController {
    static cmdName = "payments-flat";

    resyncExercice(exerciceBudgetaire: number) {
        if (!exerciceBudgetaire) {
            this.logger.logIC("Exercice budgetaire is required");
            return;
        }
        this.logger.logIC(`Resync payment flat collection for exercice ${exerciceBudgetaire}`);
        return paymentsFlatService.updatePaymentsFlatCollection(exerciceBudgetaire);
    }

    resyncAll() {
        this.logger.logIC("Create or resync all payment flat collection");
        return paymentsFlatService.updatePaymentsFlatCollection();
    }
}
