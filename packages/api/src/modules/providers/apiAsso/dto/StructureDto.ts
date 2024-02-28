import { Rna } from "dto";

export interface StructureEtablissementDto {
    id_siret: number;
    id_siren: number;
    actif: boolean;
    date_actif: string;
    est_siege: boolean;
    nom?: string;
    telephone?: string;
    courriel?: string;
    note?: string;
    id_activite_principale: string;
    lib_activite_principale: string;
    annee_activite_principale: number;
    id_tranche_effectif: string;
    lib_tranche_effectif: string;
    effectif_salarie_cent: string;
    annee_effectif_salarie_cent: number;
    adresse: {
        cplt_1?: string;
        cplt_2?: string;
        cplt_3?: string;
        num_voie?: number;
        type_voie?: string;
        voie?: string;
        bp?: string;
        cedex?: string;
        cp?: number;
        commune?: string;
        code_insee?: number;
        pays?: string;
    };
}

export interface StructureRibDto {
    titulaire: string;
    banque: string;
    domiciliation: string;
    iban: string;
    bic: string;
    deleted: boolean;
    id_siret: number;
    url?: string;
}

export interface StructureRepresentantLegalDto {
    civilité: string;
    nom: string;
    prenom: string;
    fonction: string;
    est_representant_legal: boolean;
    valideur_cec: boolean;
    publication_internet: boolean;
    telephone: string;
    courriel: string;
    deleted: boolean;
    id_siret: number;
}

export interface StructureRnaDocumentDto {
    id: string;
    type: string;
    sous_type: string;
    lib_sous_type: string;
    annee?: number;
    time?: number;
    url: string;
}

export interface StructureDacDocumentDto {
    uuid: string;
    origin: string;
    nom: string;
    commentaire: string;
    annee_validite: number;
    time_depot: string;
    url: string;
    etat: string;
    meta: {
        type: string;
        id_siret: number;
        etat: string;
        iban?: string;
    };
}

export interface StructureDocumentDto {
    asso: {
        documents: DocumentsDto;
    };
}

export interface DocumentsDto {
    nbDocDac: number;
    nbDocRna: number;
    document_dac: StructureDacDocumentDto[];
    document_rna: StructureRnaDocumentDto[];
}

export default interface StructureDto {
    identite: {
        nom: string;
        nom_sirene?: string;
        sigle: string;
        sigle_sirene?: string;
        id_rna: Rna;
        id_ex: string;
        id_siren?: number;
        id_siret_siege: number;
        id_correspondance: string;
        id_forme_juridique: string;
        lib_forme_juridique: string;
        regime: string;
        date_pub_registre?: string;
        volume?: string;
        folio?: string;
        tribunal_instance?: string;
        date_pub_jo?: string;
        date_creat: string;
        date_creation_sirene: string;
        date_dissolution: string;
        date_modif_rna: string;
        date_modif_siren: string;
        nature: string;
        active: boolean;
        util_publique: boolean;
        date_publication_util_publique: string;
        groupement: string;
        domaine: string;
        type_structure_sportive?: string;
        eligibilite_cec: boolean;
        raison_non_eligibilite_cec: string;
        impots_commerciaux: boolean;
    };
    activites: {
        objet: string;
        id_objet_social1: string;
        lib_objet_social1: string;
        id_objet_social2: string;
        lib_objet_social2: string;
        id_activite_principale: string;
        lib_activite_principale: string;
        annee_activite_principale: number;
        champ_action_territorial: string;
        id_tranche_effectif: string;
        lib_tranche_effectif: string;
        effectif_salarie_cent: string;
        annee_effectif_salarie_cent: number;
        appartenance_ess: string;
        date_appartenance_ess: string;
        volontaire_passsport: boolean;
        activites_passsport: string;
        accueil_handicap_moteur: boolean;
        accueil_handicap_mental: boolean;
    };
    coordonnees: {
        adresse_siege: {
            cplt_1?: string;
            cplt_2?: string;
            cplt_3?: string;
            num_voie?: number;
            type_voie?: string;
            voie?: string;
            bp?: string;
            cedex?: string;
            cp?: string;
            commune?: string;
            code_insee?: number;
        };
        adresse_siege_sirene?: {
            cplt_1?: string;
            cplt_2?: string;
            cplt_3?: string;
            num_voie?: number;
            type_voie?: string;
            voie?: string;
            bp?: string;
            cedex?: string;
            cp?: number;
            commune?: string;
            code_insee?: number;
        };
        adresse_gestion?: {
            cplt_1?: string;
            cplt_2?: string;
            cplt_3?: string;
            num_voie?: number;
            type_voie?: string;
            voie?: string;
            bp?: string;
            cedex?: string;
            cp?: number;
            commune?: string;
            code_insee?: number;
            pays?: string;
        };
        telephone?: string;
        courriel?: string;
        site_web?: string;
        publication_internet?: boolean;
    };
    reseau_affiliation: {
        id_rna: string;
        id_siren: number; // not tested since 2023-11-15 change
        nom: string;
        objet: string;
        adresse: string;
        telephone: string;
        courriel: string;
        nb_licencies: number;
        nb_licencies_h: number;
        nb_licencies_f: number;
        numero: string;
        url: string | number;
    }[];
    composition_reseau: {
        nom: string;
        id_rna: string;
        objet: string;
        id_siren: number;
        adresse: string;
    }[];
    adherent_personne_morales: {
        nom: string;
        siret: number;
        id: number;
    }[];
    representant_legal: StructureRepresentantLegalDto[];
    agrement: {
        type: string;
        numero: string;
        niveau: string;
        attributeur: string;
        date_attribution: string;
        url: string | number;
    }[];
    rh: {
        annee: number;
        nb_adherents: number;
        nb_adherents_h: number;
        nb_adherents_f: number;
        nb_benevoles: number;
        nb_volontaires: number;
        nb_salaries: number;
        nb_salaries_etpt: number;
        nb_emplois_aides: number;
        nb_personnels_detaches: number;
        cumul_top_5_salaires: number;
        id_siret: number;
    }[];
    compte: {
        annee: number;
        a_commissaire_aux_comptes: boolean;
        dons: number;
        subv: number;
        subv_cause: string;
        aides_3ans: number;
        charges: number;
        produits: number;
        resultat: number;
        id_siret: number;
    }[];
    etablissement: StructureEtablissementDto[];
    rib: StructureRibDto[];
    commentaire?: {
        note: string;
    };

    document_rna: StructureRnaDocumentDto[];
    document_dac: StructureDacDocumentDto[];
}
