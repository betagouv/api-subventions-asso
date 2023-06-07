import { valueOrHyphen, numberToEuro } from "@helpers/dataHelper";
import { withTwoDigitYear } from "@helpers/dateHelper";
import { getLastVersementsDate } from "@components/SubventionsVersementsDashboard/helper";

export default class VersementsAdapter {
    static toVersement(versements) {
        return {
            totalAmount: valueOrHyphen(this._getTotalPayment(versements)),
            centreFinancier: valueOrHyphen(versements[0]?.centreFinancier),
            lastVersementDate: valueOrHyphen(withTwoDigitYear(getLastVersementsDate(versements))),
            bop: valueOrHyphen(this.formatBop(versements[0]?.bop)),
        };
    }

    static formatBop(bop) {
        // transform 0163 in 163
        if (!bop || bop[0] !== "0") return bop;
        return bop.substring(1, 4);
    }

    static _getTotalPayment(versements) {
        if (!versements || !versements.length) return undefined;

        return numberToEuro(this._countTotalVersement(versements));
    }

    static _countTotalVersement(versements) {
        return versements.reduce((acc, versement) => acc + versement.amount, 0);
    }
}
