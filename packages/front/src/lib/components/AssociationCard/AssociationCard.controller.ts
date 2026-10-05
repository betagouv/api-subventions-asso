import { getFirstPartAddress, getLastPartAddress } from "$lib/resources/associations/association.helper";
import type { RechercheAssociationDto } from "dto";

export default class AssociationCardController {
    constructor(
        public simplifiedAsso: RechercheAssociationDto,
        public searchKey: string | undefined,
    ) {}

    get url(): string {
        const identifier =
            this.searchKey === this.simplifiedAsso.rna
                ? this.simplifiedAsso.siren
                : this.searchKey === this.simplifiedAsso.siren
                  ? this.simplifiedAsso.rna
                  : this.simplifiedAsso.rna || this.simplifiedAsso.siren;

        return `/association/${identifier}`;
    }

    get street(): string {
        if (!this.simplifiedAsso.adresse) return "";
        return getFirstPartAddress(this.simplifiedAsso.adresse);
    }

    get city(): string {
        if (!this.simplifiedAsso.adresse) return "";
        return getLastPartAddress(this.simplifiedAsso.adresse);
    }

    get nbEtabsLabel(): string {
        if (!this.simplifiedAsso.nbEtabs || this.simplifiedAsso.nbEtabs == 1) return "1 établissement rattaché";
        else return `${this.simplifiedAsso.nbEtabs} établissements rattachés`;
    }
}
