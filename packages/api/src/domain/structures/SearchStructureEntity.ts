import { Address } from "../../@types/Address";
import { Siren, Rna } from "../../identifier-objects";

export interface SearchStructureProps {
    siren: Siren;
    rna: Rna | null;
    name: string;
    address: Address | null;
}

export default class SearchStructureEntity {
    public siren!: Siren;
    public rna!: Rna | null;
    public name!: string;
    public address!: Address | null;

    constructor(props: SearchStructureProps) {
        Object.assign(this, props);
    }
}
