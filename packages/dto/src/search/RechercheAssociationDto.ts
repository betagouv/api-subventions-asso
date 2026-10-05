import { Adresse, RnaDto, SirenDto } from "../shared";
export interface RechercheAssociationDto {
    siren: SirenDto | null;
    name: string | null; // should not be null but we guard ourselves
    rna: RnaDto | null;
    siretSiege: string | null; // should not be null but we guard ourselves
    adresse: Adresse | null;
    nbEtabs: number | null; // should not be null but we guard ourselves
}
