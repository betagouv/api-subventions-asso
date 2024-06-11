import lodash from "lodash";
import { sortByDateAsc, isValidDate } from "$lib/helpers/dateHelper";

const isPaymentValid = payment => {
    return isValidDate(new Date(payment.dateOperation)) && typeof payment.amount == "number";
};

const linkPaymentsToSubvention = elements =>
    elements.reduce((acc, group) => {
        const subventions = group.filter(element => element.isSub);
        const payments = group.filter(element => element.isPayment && isPaymentValid(element));

        const lastSub = subventions.reduce((lastSub, curr) => {
            if (!lastSub) return curr;

            if (lastSub.date_fin < curr.date_fin) return curr;
            return lastSub;
        }, null);

        const siret = lastSub?.siret || payments.find(v => v.siret)?.siret;

        const date = lastSub?.annee_demande ? new Date(lastSub.annee_demande) : getLastPaymentsDate(payments);
        if (!date || isNaN(date)) return acc;

        acc.push({
            subvention: lastSub,
            payments: payments,
            siret,
            date: lastSub?.annee_demande ? new Date(lastSub.annee_demande) : getLastPaymentsDate(payments),
            year: lastSub?.annee_demande ? lastSub.annee_demande : getLastPaymentsDate(payments).getFullYear(),
        });

        return acc;
    }, []);

export const mapSubventionsAndPayments = ({ subventions, payments }) => {
    const taggedSubventions = subventions.map(s => ({ ...s, isSub: true }));
    const taggedPayments = payments.map(s => ({ ...s, isPayment: true }));

    const elementsGroupedByVersementKey = [...taggedSubventions, ...taggedPayments].reduce(groupByVersementKey, {
        none: [],
        withKey: {},
    });

    const flattenElements = [
        ...Object.values(elementsGroupedByVersementKey.withKey),
        ...elementsGroupedByVersementKey.none,
    ];

    const uniformizedElements = linkPaymentsToSubvention(flattenElements);
    return uniformizedElements.sort(sortByDateAsc);
};

// Return year of subvention or payment as a string
export const getYearOfElement = element => {
    if (element.isSub) return getSubventionYear(element);
    if (element.isPayment) return getPaymentYear(element);
};

export const getSubventionYear = subvention => subvention.annee_demande;

export const getPaymentYear = payment => {
    if (payment.periodeDebut) return new Date(payment.periodeDebut).getFullYear();
    if (payment.dateOperation) return new Date(payment.dateOperation).getFullYear();
};

const groupByVersementKey = (acc, curr) => {
    if (!curr.versementKey) {
        // impossible de lier car pas de clef de liaison
        acc.none.push([curr]);
        return acc;
    }

    const year = getYearOfElement(curr);
    const yearStr = year ? String(year) : "";
    const key = `${curr.versementKey}-${yearStr}`; // Discuter avec maxime pour faire cette manip cotée api

    if (!acc.withKey[key]) acc.withKey[key] = [];

    acc.withKey[key].push(curr);

    return acc;
};

export const getLastPaymentsDate = payments => {
    const orderedPayments = payments.sort((paymentA, paymentB) => {
        const dateA = new Date(paymentA.dateOperation);
        const dateB = new Date(paymentB.dateOperation);

        return dateB.getTime() - dateA.getTime();
    });

    if (!orderedPayments.length) return null;

    return new Date(orderedPayments[0].dateOperation);
};

export const sortByPath = (elements, path) => {
    return elements.sort((elementA, elementB) => {
        let attributeA;
        let attributeB;

        if (path.includes("lastDate")) {
            attributeA = getLastPaymentsDate(elementA.payments || []);
            attributeB = getLastPaymentsDate(elementB.payments || []);
        } else if (path.includes("amount")) {
            attributeA = elementA.payments?.reduce((acc, payment) => acc + payment.amount, 0);
            attributeB = elementB.payments?.reduce((acc, payment) => acc + payment.amount, 0);
        } else {
            attributeA = lodash.get(elementA, path);
            attributeB = lodash.get(elementB, path);
        }

        if (!attributeA && !attributeB) return sortByDateAsc(elementB, elementA);
        else if (!attributeA) return 1;
        else if (!attributeB) return -1;

        if (typeof attributeA == "number" || !isNaN(Number(attributeA))) {
            return attributeB - attributeA;
        }

        // Check if string is date
        const dateA = new Date(attributeA);
        const dateB = new Date(attributeB);

        if (!isNaN(dateA) && !isNaN(dateB)) {
            return dateB.getTime() - dateA.getTime();
        }

        if (attributeB.toLowerCase() > attributeA.toLowerCase()) return 1;
        if (attributeB.toLowerCase() < attributeA.toLowerCase()) return -1;

        return sortByDateAsc(elementB, elementA);
    });
};
