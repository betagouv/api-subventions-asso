import { valueOrHyphen, numberToEuro } from "$lib/helpers/dataHelper";
import { withTwoDigitYear } from "$lib/helpers/dateHelper";
import { getLastPaymentsDate } from "$lib/components/SubventionsPaymentsDashboard/helper";

export default class PaymentsAdapter {
    static toPayment(payments) {
        return {
            totalAmount: valueOrHyphen(this._getTotalPayment(payments)),
            centreFinancier: valueOrHyphen(payments[0]?.centreFinancier),
            lastPaymentDate: valueOrHyphen(withTwoDigitYear(getLastPaymentsDate(payments))),
            bop: valueOrHyphen(this.formatBop(this._chooseBop(payments))),
        };
    }

    static _chooseBop(payments) {
        let currentBop;
        for (const payment of payments) {
            if (currentBop && payment?.bop && currentBop !== payment?.bop) return "multi-BOP";
            if (!currentBop && payment?.bop) currentBop = payment?.bop;
        }
        return currentBop;
    }

    static formatBop(bop) {
        // transform 0163 in 163
        if (!bop || bop[0] !== "0") return bop;
        return bop.substring(1, 4);
    }

    static _getTotalPayment(payments) {
        if (!payments || !payments.length) return undefined;

        return numberToEuro(this._countTotalPayment(payments));
    }

    static _countTotalPayment(payments) {
        return payments.reduce((acc, payment) => acc + payment.amount, 0);
    }
}
