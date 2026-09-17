import { Adresse, RnaDto, SirenDto } from "../shared";
export interface RechercheAssociationDto {
    siren: SirenDto;
    name: string;
    rna: RnaDto | null;
    adresse: Adresse;
    nbEtabs: number | null;
}
