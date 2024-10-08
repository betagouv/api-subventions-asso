import { ApplicationStatus } from "dto";
import Store from "../../../core/Store";

import { numberToEuro, valueOrHyphen } from "$lib/helpers/dataHelper";
import { withTwoDigitYear } from "$lib/helpers/dateHelper";
import PaymentsAdapter from "$lib/resources/payments/payments.adapter";

const MONTANT_VERSE_LABEL = "Versé";
const PROGRAMME_LABEL = "Programme";

export default class PaymentTableController {
    constructor(sortMethod) {
        this.sortMethod = sortMethod;
        this.elements = [];
        this.sortColumn = [];

        this.elementsDataViews = new Store([]);
        this.columnDataViews = new Store([]);
        this.noPayments = new Store(false);

        this.buildColumnDataViews();
    }

    _countPayments() {
        return this.elements.filter(e => e.payments?.length).length;
    }

    sort(column) {
        this.sortColumn = column;
        this.columnDataViews.update(columnDataViews => this.updateColumnDataViews(columnDataViews));
    }

    updateElements(elements) {
        this.elements = elements;

        const elementsDataViews = this.elements.map(element => {
            // quick win, will be handled properly with table refactor (link sub-payment from API)
            if (element.subvention && element.subvention.statut_label === ApplicationStatus.GRANTED) {
                if (element.payments.length === 0) return { payments: null };
                else
                    return {
                        ...PaymentsAdapter.toPayment(element.payments),
                        payments: element.payments,
                        paymentsModal: element.payments.map(this.buildPaymentsModal),
                    };
            } else return null;
        });

        this.elementsDataViews.set(elementsDataViews);
        this.noPayments.set(!this._countPayments());
    }

    buildPaymentsModal(payment) {
        return {
            amount: numberToEuro(payment.amount),
            domaineFonctionnel: valueOrHyphen(payment.domaineFonctionnel),
            activitee: valueOrHyphen(payment.activitee),
            centreFinancier: valueOrHyphen(payment.centreFinancier),
            date: withTwoDigitYear(new Date(payment.dateOperation)).slice(0, 8),
            programme: PaymentsAdapter.buildProgrammeText([payment]),
        };
    }

    buildColumnDataViews() {
        const columnsName = {
            "payments.montant": MONTANT_VERSE_LABEL,
            "payments.programme": PROGRAMME_LABEL,
        };

        this.columnDataViews.set(
            Object.entries(columnsName).map(([name, label]) => ({
                label,
                name,
                action: () => this.sortMethod(name),
                active: this.sortColumn === name,
            })),
        );
    }

    updateColumnDataViews(columnDataViews) {
        columnDataViews.forEach(dataView => (dataView.active = this.sortColumn === dataView.name));
        return columnDataViews;
    }
}
