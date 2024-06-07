import Store from "$lib/core/Store";

import { numberToEuro, valueOrHyphen } from "$lib/helpers/dataHelper";

export default class SubventionsPaymentsStatistiqueController {
    constructor() {
        this.elements = [];
        this.paymentsAmount = new Store("-");
    }

    updateElements(elements) {
        this.elements = elements;
        this.update();
    }

    _computePaymentsAmount() {
        return this.elements.reduce((acc, element) => {
            return element.payments.reduce((total, payment) => total + payment.amount, acc);
        }, 0);
    }

    update() {
        this.paymentsAmount.set(valueOrHyphen(numberToEuro(this._computePaymentsAmount())));
    }
}
