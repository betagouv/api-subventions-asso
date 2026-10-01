import { Address } from "../@types/Address";
import { Rna, Siret } from "../identifier-objects";
import Siren from "../identifier-objects/Siren";

export interface AssociationSearchProps {
    siren?: string;
    rna?: string;
    mainEstablishmentSiret?: string;
    name: { rna?: string; sirene: string } | { rna: string; sirene?: string };
    object?: string;
    address?: Address;
    nbEstabs?: number;
}

// Only used for the search itself, to return data from API call in a well formatted way
export default class AssociationSearchEntity {
    public name: AssociationSearchProps["name"];
    public siren?: Siren;
    public rna?: Rna;
    public mainEstablishmentSiret?: Siret;
    public object?: AssociationSearchProps["object"];
    public address?: AssociationSearchProps["address"];
    public nbEstabs?: AssociationSearchProps["nbEstabs"];

    constructor(props: AssociationSearchProps) {
        this.siren = Siren.isSiren(props.siren) ? new Siren(props.siren as string) : undefined;
        this.mainEstablishmentSiret = Siret.isSiret(props.mainEstablishmentSiret)
            ? new Siret(props.mainEstablishmentSiret as string)
            : undefined;
        this.rna = Rna.isRna(props.rna) ? new Rna(props.rna as string) : undefined;
        this.name = props.name;
        this.object = props.object;
        this.address = props.address;
        this.nbEstabs = props.nbEstabs;
    }
}
