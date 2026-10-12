import type { AssociationNameDto } from "dto";

export type AssociationTagAssociation = Pick<AssociationNameDto, "name"> &
    Partial<Pick<AssociationNameDto, "rna" | "siren">>;

export default class AssociationTagController {
    constructor(public simplifiedAsso: AssociationTagAssociation) {}

    get url(): string {
        return `/association/${this.pageIdentifier}`;
    }

    get pageIdentifier(): string {
        return this.simplifiedAsso.rna || this.simplifiedAsso.siren || "";
    }

    get identifier(): string {
        return this.simplifiedAsso.siren || this.simplifiedAsso.rna || "";
    }

    get label(): string {
        if (!this.identifier) return this.simplifiedAsso.name;

        return `${this.simplifiedAsso.name} - ${this.identifier}`;
    }
}
