import { valueOrHyphen, numberToEuro } from "$lib/helpers/dataHelper";
import { withTwoDigitYear } from "$lib/helpers/dateHelper";
import { getLastVersementsDate } from "$lib/components/SubventionsVersementsDashboard/helper";

export default class VersementsAdapter {
    static toVersement(versements) {
        return {
            totalAmount: valueOrHyphen(this._getTotalPayment(versements)),
            centreFinancier: valueOrHyphen(versements[0]?.centreFinancier),
            lastVersementDate: valueOrHyphen(withTwoDigitYear(getLastVersementsDate(versements))),
            bop: valueOrHyphen(this.formatBop(this._chooseBop(versements))),
        };
    }

    static _chooseBop(versements) {
        let currentBop;
        for (const versement of versements) {
            if (currentBop && versement?.bop && currentBop !== versement?.bop) return "multi-BOP";
            if (!currentBop && versement?.bop) currentBop = versement?.bop;
        }
        return currentBop;
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
