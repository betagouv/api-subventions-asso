import { Adresse, RnaDto, SirenDto } from "../shared";
export interface RechercheAssociationDto {
    siren: SirenDto;
    name: string;
    rna: RnaDto | null; // after association search refactor finished this should never be null
    siretSiege: string | null; // after association search refactor finished this should never be null
    adresse: Adresse;
    nbEtabs: number | null; // after association search refactor finished this should never be null
}
