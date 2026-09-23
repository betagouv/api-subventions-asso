import { Address } from "../../../../../@types/Address";

type WithSiren = Partial<AssociationSearchDbo> & {
    siren: AssociationSearchDbo["siren"];
};

type WithRna = Partial<AssociationSearchDbo> & {
    rna: AssociationSearchDbo["rna"];
};

export type AssociationSearchPartialUpdate = WithSiren | WithRna;

export default interface AssociationSearchDbo {
    siren: string;
    mainEstablishmentSiret: string;
    rna: string;
    name: string;
    searchName: string; // sanitized name for the search engine
    object: string | null;
    searchObject: string | null; // sanitized object for the search engine
    address: Address | null;
    nbEstabs: number | null;
    postalCodes?: string[];
}
