import type {
    Adresse,
    BodaccRecordDto,
    DemandeSubvention,
    Etablissement,
    ExtraitRcsDto,
    RnaDto,
    SirenDto,
    SiretDto,
    Payment,
} from "dto";

export default class AssociationEntity {
    rna: RnaDto;
    siren: SirenDto;
    nic_siege: string;
    categorie_juridique: string;
    denomination_siren: string;
    denomination_rna: string;
    date_creation_siren: Date;
    date_creation_rna: Date;
    date_modification_rna: Date;
    date_modification_siren: Date;
    objet_social: string;
    code_objet_social_1: string;
    code_objet_social_2: string;
    etablisements_siret: SiretDto[];
    adresse_siege_rna: Adresse;
    adresse_siege_siren: Adresse;
    federation: string;
    licencies: { total: number; hommes: number; femmes: number };
    benevoles: { nombre: number; ETPT: number };
    salaries: {
        nombre: number;
        cdi: number;
        cdiETPT: number;
        cdd: number;
        cddETPT: number;
        emploisAides: number;
        emploisAidesETPT: number;
    };
    volontaires: { nombre: number; ETPT: number };
    payments: Payment[];
    etablissements: ({ demandes_subventions: DemandeSubvention[] | null } & Etablissement)[] | null;
    extrait_rcs: ExtraitRcsDto;
    bodacc: BodaccRecordDto;

    constructor({
        rna,
        siren,
        nic_siege,
        categorie_juridique,
        denomination_siren,
        denomination_rna,
        date_creation_siren,
        date_creation_rna,
        date_modification_rna,
        date_modification_siren,
        objet_social,
        code_objet_social_1,
        code_objet_social_2,
        etablisements_siret,
        adresse_siege_rna,
        adresse_siege_siren,
        federation,
        licencies,
        benevoles,
        salaries,
        volontaires,
        payments,
        etablissements,
        extrait_rcs,
        bodacc,
    }) {
        this.rna = rna;
        this.siren = siren;
        this.nic_siege = nic_siege;
        this.categorie_juridique = categorie_juridique;
        this.denomination_siren = denomination_siren;
        this.denomination_rna = denomination_rna;
        this.date_creation_siren = date_creation_siren;
        this.date_creation_rna = date_creation_rna;
        this.date_modification_rna = date_modification_rna;
        this.date_modification_siren = date_modification_siren;
        this.objet_social = objet_social;
        this.code_objet_social_1 = code_objet_social_1;
        this.code_objet_social_2 = code_objet_social_2;
        this.etablisements_siret = etablisements_siret;
        this.adresse_siege_rna = adresse_siege_rna;
        this.adresse_siege_siren = adresse_siege_siren;
        this.federation = federation;
        this.licencies = licencies;
        this.benevoles = benevoles;
        this.salaries = salaries;
        this.volontaires = volontaires;
        this.payments = payments;
        this.etablissements = etablissements;
        this.extrait_rcs = extrait_rcs;
        this.bodacc = bodacc;
    }
}
