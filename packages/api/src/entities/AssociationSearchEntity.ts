import { Address } from "../@types/Address";
import { Rna } from "../identifier-objects";
import Siren from "../identifier-objects/Siren";
import { removeAccents } from "../shared/helpers/StringHelper";

interface AssociationSearchProps {
    siren: Siren;
    name: string;
    rna?: Rna;
    address?: Address;
    nbEstabs?: number;
    searchKey?: string;
}

export type AssociationSearchPartialUpdate = Partial<AssociationSearchEntity>;

export default class AssociationSearchEntity {
    public siren: Siren;
    public rna: Rna | null;
    public name: string;
    public address: Address | null;
    public nbEstabs: number | null;
    public searchKey: string;

    constructor(props: AssociationSearchProps) {
        this.siren = props.siren;
        this.rna = props.rna ?? null;
        this.name = props.name;
        this.address = props.address ?? null;
        this.nbEstabs = props.nbEstabs ?? null;
        this.searchKey = props.searchKey ? props.searchKey : this.buildSearchKey(props);
    }

    private buildSearchKey(props: AssociationSearchProps) {
        const nameLC = props.name.toLowerCase();
        let key = `${props.siren.value} - ${nameLC}`;

        const nameWithoutAccent = removeAccents(nameLC);
        if (nameLC != nameWithoutAccent) {
            key += ` - ${nameWithoutAccent}`;
        }

        if (props.rna) key += `- ${props.rna.value}`; // only rna can be null

        return key;
    }
}
