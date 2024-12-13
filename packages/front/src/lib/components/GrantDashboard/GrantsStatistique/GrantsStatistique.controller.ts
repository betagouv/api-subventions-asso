import type { FlatGrant } from "$lib/resources/@types/FlattenGrant";
import Store from "$lib/core/Store";
import { numberToEuro, valueOrHyphen } from "$lib/helpers/dataHelper";
import { currentAssoSimplifiedEtabs } from "$lib/store/association.store";

export default class GrantsStatistiqueController {
    private grants: FlatGrant[];
    public paymentsAmount: Store<string>;
    public paymentsRepartition: Store<{ paid: number; total: number } | undefined>;

    constructor() {
        this.grants = [];
        this.paymentsAmount = new Store("-");
        this.paymentsRepartition = new Store(undefined);
    }

    updateElements(grants) {
        this.grants = grants;
        this.update();
    }

    _computePaymentsAmount() {
        return this.grants.reduce((acc, grant) => {
            if (!grant.payments) return acc;
            return grant.payments.reduce((total, payment) => total + payment.amount, acc);
        }, 0);
    }

    _computeRepartition() {
        const establishments = new Set();
        this.grants.forEach(grant => {
            if (!grant.application) return;
            establishments.add(grant.application.siret.toString());
        });
        if (currentAssoSimplifiedEtabs.value.length === 1) return undefined;
        return { paid: establishments.size, total: currentAssoSimplifiedEtabs.value.length };
    }

    update() {
        this.paymentsAmount.set(valueOrHyphen(numberToEuro(this._computePaymentsAmount())));
        this.paymentsRepartition.set(this._computeRepartition());
    }
}
