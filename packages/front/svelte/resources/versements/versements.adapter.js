import { valueOrHyphen, numberToEuro } from "@helpers/dataHelper";
import { withTwoDigitYear } from "@helpers/dateHelper";
import { getLastVersementsDate } from "@components/SubventionsVersementsDashboard/helper";

export default class VersementsAdapter {
    static toVersement(versements) {
        return {
            totalAmount: numberToEuro(this._countTotalVersement(versements)),
            centreFinancier: valueOrHyphen(versements[0]?.centreFinancier),
            lastVersementDate: valueOrHyphen(withTwoDigitYear(getLastVersementsDate(versements)))
        };
    }

    static _countTotalVersement(versements) {
        return versements.reduce((acc, versement) => acc + versement.amount, 0);
    }
}
