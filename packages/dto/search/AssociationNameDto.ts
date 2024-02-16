import { Adresse, Rna, Siren } from "../shared";

export interface AssociationNameDto {
    siren: Siren;
    name: string;
    rna?: Rna;
    address?: Adresse;
    nbEtabs?: number;
}

export interface PaginatedAssociationNameDto {
    results: AssociationNameDto[];
    nbPages: number;
    page: number;
    totalResults: number;
}
