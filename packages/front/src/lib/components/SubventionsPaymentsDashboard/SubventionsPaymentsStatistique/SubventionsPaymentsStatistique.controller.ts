import Store from "$lib/core/Store";

import { numberToEuro, valueOrHyphen } from "$lib/helpers/dataHelper";
import { currentAssoSimplifiedEtabs } from "$lib/store/association.store";

export default class SubventionsPaymentsStatistiqueController {
    private elements: any[];
    public paymentsAmount: Store<string>;
    public paymentsRepartition: Store<{ paid: number; total: number } | undefined>;

    constructor() {
        this.elements = [];
        this.paymentsAmount = new Store("-");
        this.paymentsRepartition = new Store();
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

    _computeRepartition() {
        const establishments = new Set();
        this.elements.forEach(e => establishments.add(e.siret));
        if (establishments.size === 1) return undefined;
        return { paid: establishments.size, total: currentAssoSimplifiedEtabs.value.length };
    }

    update() {
        this.paymentsAmount.set(valueOrHyphen(numberToEuro(this._computePaymentsAmount())));
        this.paymentsRepartition.set(this._computeRepartition());
    }
}
