import { Adresse, RnaDto, SirenDto } from "../shared";

export interface AssociationNameDto {
    siren: SirenDto;
    name: string;
    rna?: RnaDto;
    address?: Adresse;
    nbEtabs?: number;
}
