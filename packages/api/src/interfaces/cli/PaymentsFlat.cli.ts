import { ObjectId } from "mongodb";
import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";

import paymentsFlatService from "../../modules/data-viz/paymentFlat/paymentFlat.service";

@StaticImplements<CliStaticInterface>()
export default class PaymentsFlatCli {
    static cmdName = "payments-flat";

    async resync() {
        console.log("Resyncing payments flat collection");
        await paymentsFlatService.updatePaymentsFlatCollection();
    }
}
