import type { Adresse, RnaDto, SirenDto } from "dto";

export interface SearchHistory {
    rna: RnaDto;
    siren: SirenDto;
    name: string;
    address: Adresse;
    nbEtabs: number;
}
