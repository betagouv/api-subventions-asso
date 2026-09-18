import { Address } from "../@types/Address";
import { Rna, Siret } from "../identifier-objects";
import Siren from "../identifier-objects/Siren";
import { removeAccents } from "../shared/helpers/StringHelper";

interface AssociationSearchProps {
    siren: Siren;
    rna?: Rna;
    mainEstablishmentSiret: Siret;
    name: string;
    object?: string;
    address?: Address;
    nbEstabs?: number;
    searchKey?: string;
}

type WithSiren = Partial<AssociationSearchEntity> & {
    siren: AssociationSearchEntity["siren"];
};

type WithRna = Partial<AssociationSearchEntity> & {
    rna: AssociationSearchEntity["rna"];
};

export type AssociationSearchPartialUpdate = WithSiren | WithRna;

export default class AssociationSearchEntity {
    public siren: Siren;
    public rna: Rna | null;
    public mainEstablishmentSiret: Siret;
    public name: string;
    public object: string | null;
    public address: Address | null;
    public nbEstabs: number | null;
    public searchKey: string;

    constructor(props: AssociationSearchProps) {
        this.siren = props.siren;
        this.mainEstablishmentSiret = props.mainEstablishmentSiret;
        this.rna = props.rna ?? null;
        this.name = props.name;
        this.object = props.object ?? null;
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
