import { Rna, Siren } from "../shared";

export interface AssociationNameDto {
    siren: Siren;
    name: string;
    rna?: Rna;
}
