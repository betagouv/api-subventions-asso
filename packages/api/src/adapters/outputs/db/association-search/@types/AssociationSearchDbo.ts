import { Address } from "../../../../../@types/Address";

export default interface AssociationSearchDbo {
    searchKey: string;
    siren: string;
    rna: string | null;
    name: string;
    address: Address | null;
    nbEstabs: number | null;
}
