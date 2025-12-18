import type { TableCell } from "$lib/dsfr/TableCell.types";
import { numberToEuro, valueOrHyphen } from "$lib/helpers/dataHelper";
import { withTwoDigitYear } from "$lib/helpers/dateHelper";
import type { DashboardPayment, DashboardProgram } from "$lib/components/GrantDashboard/@types/DashboardGrant";
import type { PaymentFlatDto } from "dto";

const MULTI = "multi";

export const getPaymentsCells = (payments: PaymentFlatDto[] | null): TableCell[] | null => {
    if (!payments?.length) return null;
    const lastPaymentDate = withTwoDigitYear(getLastPaymentsDate(payments));
    return [
        {
            title: valueOrHyphen(numberToEuro(getTotalPayment(payments))),
            desc: lastPaymentDate ? `Dernier versement le ${lastPaymentDate}` : "",
        },
        { desc: valueOrHyphen(buildProgrammeText(payments)) },
    ];
};

export const getPaymentDashboardData = (payments: PaymentFlatDto[] | null): DashboardPayment | null => {
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
export const buildProgramme: (p: PaymentFlatDto[]) => DashboardProgram = (payments: PaymentFlatDto[]) => {
    const programmes = new Set(payments.map(versement => versement.programme));
    if (programmes.size > 1) return MULTI;
    if (programmes.size < 1) return null;
    return { code: payments[0].numeroProgramme, libelle: valueOrHyphen(payments[0].programme) };
};

/**
 * Builds the program text based on the given payments.
 * @param {Array} payments - The array of payments.
 * @returns {string} The program text.
 */
export const buildProgrammeText = (payments: PaymentFlatDto[]) => {
    const programmes = new Set(payments.map(versement => versement.programme));
    if (programmes.size === 0) return "-";
    if (programmes.size > 1) return "multi-programmes";
    return `${payments[0].numeroProgramme} - ${valueOrHyphen(payments[0].programme)}`;
};

export const getTotalPayment = (payments: PaymentFlatDto[]) => {
    return payments.reduce((acc, payment) => acc + payment.montant, 0);
};

export const getLastPaymentsDate = (payments: PaymentFlatDto[]) => {
    const orderedPayments = payments.sort((paymentA, paymentB) => {
        const dateA = new Date(paymentA.dateOperation);
        const dateB = new Date(paymentB.dateOperation);

        return dateB.getTime() - dateA.getTime();
    });

    if (!orderedPayments.length) return null;
    console.log(orderedPayments[0].dateOperation);
    return new Date(orderedPayments[0].dateOperation);
};
