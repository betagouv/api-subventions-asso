import { Address } from "../@types/Address";
import { Rna, Siret } from "../identifier-objects";
import Siren from "../identifier-objects/Siren";

interface AssociationSearchProps {
    siren: string;
    rna: string;
    mainEstablishmentSiret: string;
    name: string;
    object?: string;
    address?: Address;
    nbEstabs?: number;
}

// Only used for the search itself, to return data from API call in a well formatted way
export default class AssociationSearchEntity {
    public siren: Siren;
    public rna: Rna;
    public mainEstablishmentSiret: Siret;
    public name: string;
    public object: string | null;
    public address: Address | null;
    public nbEstabs: number | null;

    constructor(props: AssociationSearchProps) {
        this.siren = new Siren(props.siren);
        this.mainEstablishmentSiret = new Siret(props.mainEstablishmentSiret);
        this.rna = new Rna(props.rna);
        this.name = props.name;
        this.object = props.object ?? null;
        this.address = props.address ?? null;
        this.nbEstabs = props.nbEstabs ?? null;
    }
}
