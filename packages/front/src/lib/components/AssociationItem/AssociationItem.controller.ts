import { getFirstPartAddress, getLastPartAddress } from "$lib/resources/associations/association.helper";
import type { RechercheAssociationDto } from "dto";

export default class AssociationItemController {
    constructor(
        public simplifiedAsso: RechercheAssociationDto,
        public searchKey: string | undefined,
    ) {}

    get url(): string {
        const identifier = this.simplifiedAsso.rna ?? this.simplifiedAsso.siren;
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
        return this.simplifiedAsso.nbEtabs == 1
            ? `${this.simplifiedAsso.nbEtabs} établissement rattaché`
            : this.simplifiedAsso.nbEtabs < 1
              ? "aucun établissement rattaché"
              : `${this.simplifiedAsso.nbEtabs} établissements rattachés`;
    }
}
