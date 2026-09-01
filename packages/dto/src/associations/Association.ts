import { Adresse, RnaDto, SirenDto, SiretDto } from "../shared";
import { AssociationNature } from "./AssociationNature";
import { ExtraitRcs } from "./ExtraitRcs";
import { EstablishmentIdentifiers, UniteLegaleIdentifiers } from "../shared/Identifiers";
import { BodaccRecord } from "./BodaccRecord";

export default interface Association {
    // fields from schema
    typeIdAsso: UniteLegaleIdentifiers;
    idAsso: SirenDto;
    typeIdEtablissementSiege: EstablishmentIdentifiers;
    idEtablissementSiege: SiretDto;
    rna: RnaDto;
    denominationSiren?: string;
    denominationRna?: string;
    adresseSiegeRna: Adresse;
    adresseSiegeSiren: Adresse;
    communeSiege: string;
    etablisementsSiret: string[];
    dateCreationSiren: Date;
    dateCreationRna: Date;
    dateModificationRna?: Date;
    dateModificationSiren?: Date;
    nature?: AssociationNature;
    // Association reconnue d'utilité publique (RUP)
    rup?: boolean;
    // Date de reconnaissance
    dateRup?: string;
    active: boolean;
    codeApe: string;
    libelleApe: string;
    objetSocial?: string;
    codeObjetSocial1?: string;
    codeObjetSocial2?: string;
    extraitRcs?: ExtraitRcs | null;
    bodacc?: BodaccRecord[];
    categorieJuridique?: string;
}
