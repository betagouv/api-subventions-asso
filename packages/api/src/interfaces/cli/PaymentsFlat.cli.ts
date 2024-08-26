import { ObjectId } from "mongodb";
import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";

import paymentsFlatService from "../../modules/data-viz/paymentFlat/paymentFlat.service";

@StaticImplements<CliStaticInterface>()
export default class PaymentsFlatCli {
    static cmdName = "payments-flat";

    async resync(lastChorusObjectId: ObjectId = new ObjectId("000000000000000000000000")) {
        // Default value is 1/1/1970 at midnight
        console.log("Resyncing payments flat collection");
        const newLastChorusObjectId = await paymentsFlatService.updatePaymentsFlatCollection(lastChorusObjectId);

        // TO DO : modify updatePaymentsFlatCollection

        return newLastChorusObjectId;
    }

    // Il faudrait enregistrer newLastChorusObjectId quelques parts de façon que le cron puisse le récupérer et changer le paramètre de la fonction resync
}
