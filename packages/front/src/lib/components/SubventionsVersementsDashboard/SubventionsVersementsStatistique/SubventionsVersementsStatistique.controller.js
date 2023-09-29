import Store from "$lib/core/Store";

import { numberToEuro, valueOrHyphen } from "$lib/helpers/dataHelper";

export default class SubventionsVersementsStatistiqueController {
    constructor() {
        this.elements = [];
        this.versementsAmount = new Store("-");
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

    update() {
        this.versementsAmount.set(valueOrHyphen(numberToEuro(this._computeVersementsAmount())));
    }
}
