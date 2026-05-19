import { Adresse, RnaDto, SirenDto, SiretDto } from "../shared";
import { AssociationNature } from "./AssociationNature";
import { BodaccRecord } from "./BodaccRecord";
import { ExtraitRcs } from "./ExtraitRcs";

export default interface Association {
    siren?: SirenDto;
    rna?: RnaDto;
    nicSiege?: string;
    categorieJuridique?: string;
    denominationSiren?: string;
    denominationRna?: string;
    dateCreationSiren?: Date;
    dateCreationRna?: Date;
    dateModificationRna?: Date;
    dateModificationSiren?: Date;
    objetSocial?: string;
    codeObjetSocial1?: string;
    codeObjetSocial2?: string;
    etablisementsSiret?: SiretDto[];
    adresseSiegeRna?: Adresse;
    adresseSiege_siren?: Adresse;
    nature?: AssociationNature;
    // Association reconnue d'utilité publique (RUP)
    rup?: boolean;
    // Date de reconnaissance
    dateRup?: string;
    federation?: string;
    licencies?: {
        // Uniquement les asso sportive
        total?: number;
        hommes?: number;
        femmes?: number;
    };
    benevoles?: {
        nombre?: number;
        etpt?: number;
    };
    salaries?: {
        nombre?: number;
        cdi?: number;
        cdiEtpt?: number;
        cdd?: number;
        cddEtpt?: number;
        emploisAides?: number;
        emploisAidesEtpt?: number;
    };
    volontaires?: {
        nombre?: number;
        etpt?: number;
    };
    extraitRcs?: ExtraitRcs | null;
    bodacc?: BodaccRecord[];
}
