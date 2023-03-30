import Store from "../../../core/Store";

import { numberToEuro, valueOrHyphen } from "@helpers/dataHelper";

export default class SubventionsVersementsStatistiqueController {
    constructor() {
        this.elements = [];

        this.versementsAmount = new Store("-");
        this.subventionsPercent = new Store(0);
    }

    updateElements(elements) {
        this.elements = elements;
        this.update();
    }

    _computeVersementsAmount() {
        return this.elements.reduce((acc, element) => {
            return element.versements.reduce((total, versement) => total + versement.amount, acc);
        }, 0);
    }

    _computeSubventionsPercent() {
        const { amountGranted, amountRequested } = this.elements.reduce(
            (acc, element) => {
                if (!element?.subvention?.montants?.accorde || !element?.subvention?.montants?.demande) return acc;
                acc.amountGranted += element.subvention.montants.accorde || 0;
                acc.amountRequested += element.subvention.montants.demande || 0;
                return acc;
            },
            { amountGranted: 0, amountRequested: 0 }
        );
        if (amountRequested === 0) return null;
        return ((amountGranted / amountRequested) * 100).toFixed(0);
    }

    update() {
        this.versementsAmount.set(valueOrHyphen(numberToEuro(this._computeVersementsAmount())));
        this.subventionsPercent.set(this._computeSubventionsPercent());
    }
}
