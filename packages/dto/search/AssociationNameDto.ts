import { Adresse, RnaDto, SirenDto } from "../shared";

export interface AssociationNameDto {
    siren: SirenDto;
    name: string;
    rna?: RnaDto;
    address?: Adresse;
    nbEtabs?: number;
}

export interface PaginatedAssociationNameDto {
    results: AssociationNameDto[];
    nbPages: number;
    page: number;
    total: number;
}
