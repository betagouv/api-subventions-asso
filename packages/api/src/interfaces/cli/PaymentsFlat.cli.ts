import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";

import paymentsFlatService from "../../modules/data-viz/paymentFlat/paymentFlat.service";
import CliController from "../../shared/CliController";

@StaticImplements<CliStaticInterface>()
export default class PaymentsFlatCli extends CliController {
    static cmdName = "payments-flat";

    async resync() {
        this.logger.logIC("Resyncing payments flat collection");
        await paymentsFlatService.updatePaymentsFlatCollection();
    }
}
