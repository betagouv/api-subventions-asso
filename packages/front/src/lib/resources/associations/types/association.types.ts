import type {
    BodaccRecordDto,
    ExtraitRcsDto,
    Versement,
    Etablissement,
    DemandeSubvention,
    Siret,
    Siren,
    Rna,
    Adresse,
} from "dto";

export interface Association {
    siren?: Siren;
    rna?: Rna;
    nic_siege?: string;
    categorie_juridique?: string;
    denomination_siren?: string;
    denomination_rna?: string;
    date_creation_siren?: Date;
    date_creation_rna?: Date;
    date_modification_rna?: Date;
    date_modification_siren?: Date;
    objet_social?: string;
    code_objet_social_1?: string;
    code_objet_social_2?: string;
    etablisements_siret?: Siret[];
    adresse_siege_rna?: Adresse;
    adresse_siege_siren?: Adresse;
    federation?: string;
    licencies?: {
        // Uniquement les asso sportive
        total?: number;
        hommes?: number;
        femmes?: number;
    };
    benevoles?: {
        nombre?: number;
        ETPT?: number;
    };
    salaries?: {
        nombre?: number;
        cdi?: number;
        cdiETPT?: number;
        cdd?: number;
        cddETPT?: number;
        emploisAides?: number;
        emploisAidesETPT?: number;
    };
    volontaires?: {
        nombre?: number;
        ETPT?: number;
    };
    versements?: Versement[];
    etablissements?: ({ demandes_subventions: DemandeSubvention[] | null } & Etablissement)[] | null;
    extrait_rcs?: ExtraitRcsDto | null;
    bodacc?: BodaccRecordDto[];
}
