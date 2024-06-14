import { valueOrHyphen, numberToEuro } from "$lib/helpers/dataHelper";
import { withTwoDigitYear } from "$lib/helpers/dateHelper";
import { getLastPaymentsDate } from "$lib/components/SubventionsPaymentsDashboard/helper";

export default class PaymentsAdapter {
    /**
     * Converts an array of payments into a payment object.
     *
     * @param {Array} payments - The array of payments.
     * @returns {Object} The payment object.
     */
    static toPayment(payments) {
        return {
            totalAmount: valueOrHyphen(this._getTotalPayment(payments)),
            centreFinancier: valueOrHyphen(payments[0]?.centreFinancier),
            lastPaymentDate: valueOrHyphen(withTwoDigitYear(getLastPaymentsDate(payments))),
            programme: valueOrHyphen(this.buildProgrammeText(payments)),
        };
    }

    /**
     * Builds the program text based on the given payments.
     * @param {Array} payments - The array of payments.
     * @returns {string} The program text.
     */
    static buildProgrammeText(payments) {
        if (!payments || !payments.length) return "";

        const programmes = new Set(payments.map(versement => versement.programme));

        if (programmes.size > 1) {
            return "multi-programmes";
        }

        return `${payments[0].programme} - ${payments[0].libelleProgramme}`;
    }

    static _getTotalPayment(payments) {
        if (!payments || !payments.length) return undefined;

        return numberToEuro(this._countTotalPayment(payments));
    }

    static _countTotalPayment(payments) {
        return payments.reduce((acc, payment) => acc + payment.amount, 0);
    }
}
