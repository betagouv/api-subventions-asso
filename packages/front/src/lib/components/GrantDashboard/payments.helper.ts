import type { FlatPayment } from "$lib/resources/@types/FlattenGrant";
import type { TableCell } from "$lib/dsfr/TableCell.types";
import { numberToEuro, valueOrHyphen } from "$lib/helpers/dataHelper";
import { withTwoDigitYear } from "$lib/helpers/dateHelper";
import type { DashboardPayment, DashboardProgram } from "$lib/components/GrantDashboard/@types/DashboardGrant";

const MULTI = "multi";

export const getPaymentsCells = (payments: FlatPayment[] | null): TableCell[] | null => {
    if (!payments) return null;
    else
        return [
            {
                title: valueOrHyphen(numberToEuro(getTotalPayment(payments))),
                desc: `Dernier versement le ${valueOrHyphen(withTwoDigitYear(getLastPaymentsDate(payments)))}`,
            },
            { desc: valueOrHyphen(buildProgrammeText(payments)) },
        ];
};

export const getPaymentDashboardData = (payments: FlatPayment[] | null): DashboardPayment | null => {
    if (!payments) return payments;
    const dernier = getLastPaymentsDate(payments);
    if (!dernier) return null;
    return {
        total: getTotalPayment(payments),
        dernier,
        programme: buildProgramme(payments),
    };
};

/**
 * Builds the program text based on the given payments.
 * @param {Array} payments - The array of payments.
 * @returns {string} The program text.
 */
export const buildProgramme: (p: FlatPayment[]) => DashboardProgram = (payments: FlatPayment[]) => {
    const programmes = new Set(payments.map(versement => versement.programme));
    if (programmes.size > 1) return MULTI;
    if (programmes.size < 1) return null;
    return { code: payments[0].programme, libelle: valueOrHyphen(payments[0].libelleProgramme) };
};

/**
 * Builds the program text based on the given payments.
 * @param {Array} payments - The array of payments.
 * @returns {string} The program text.
 */
export const buildProgrammeText = (payments: FlatPayment[]) => {
    const programmes = new Set(payments.map(versement => versement.programme));
    if (programmes.size > 1) return "multi-programmes";
    return `${payments[0].programme} - ${valueOrHyphen(payments[0].libelleProgramme)}`;
};

export const getTotalPayment = (payments: FlatPayment[]) => {
    return payments.reduce((acc, payment) => acc + payment.amount, 0);
};

export const getLastPaymentsDate = (payments: FlatPayment[]) => {
    const orderedPayments = payments.sort((paymentA, paymentB) => {
        const dateA = new Date(paymentA.dateOperation);
        const dateB = new Date(paymentB.dateOperation);

        return dateB.getTime() - dateA.getTime();
    });

    if (!orderedPayments.length) return null;

    return new Date(orderedPayments[0].dateOperation);
};
