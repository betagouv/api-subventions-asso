import type { Adresse, Rna, Siren } from "dto";

export interface SearchHistory {
    rna: Rna;
    siren: Siren;
    name: string;
    address: Adresse;
    nbEtabs: number;
}
