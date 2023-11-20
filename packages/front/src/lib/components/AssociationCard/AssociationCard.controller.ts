import { getFirstPartAddress, getLastPartAddress } from "$lib/resources/associations/association.helper";

export default class AssociationCardController {
    public simplifiedAsso;

    constructor(simplifiedAsso) {
        this.simplifiedAsso = simplifiedAsso;
    }

    get url() {
        const identifier = this.simplifiedAsso.rna ? this.simplifiedAsso.rna : this.simplifiedAsso.siren;
        return `/association/${identifier}`;
    }

    get street() {
        return getFirstPartAddress(this.simplifiedAsso.address);
    }

    get city() {
        return getLastPartAddress(this.simplifiedAsso.address);
    }

    get nbEtabsLabel() {
        return this.simplifiedAsso.nbEtabs <= 1
            ? `${this.simplifiedAsso.nbEtabs} établissement rattaché`
            : `${this.simplifiedAsso.nbEtabs} établissements rattachés`;
    }
}
