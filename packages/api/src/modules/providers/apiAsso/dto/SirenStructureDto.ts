export interface SirenStructureEtablissementDto {
    actif: boolean;
    adresse: {
        cplt_1?: string;
        num_voie: number;
        voie: string;
        commune: string;
        code_insee: number;
        cp: number;
        type_voie: string;
    };
    id_siret: number;
    est_siege: boolean;
    date_actif: string;
    id_activite_principale: string;
    annee_activite_principale: number;
    effectif_salarie_cent: number;
    id_tranche_effectif?: string;
    annee_effectif_salarie_cent: number;
}

export interface SirenStructureDto {
    identite: {
        nom: string;
        nom_sirene: string;
        id_siren: number;
        id_siret_siege: number;
        id_forme_juridique: number;
        date_creation_sirene: string;
        date_modif_siren: string;
        active: boolean;
        active_sirene: boolean;
        regime: string;
    };
    activites: {
        id_activite_principale: string;
        annee_activite_principale: number;
        id_tranche_effectif: string;
        effectif_salarie_cent: number;
        annee_effectif_salarie_cent: number;
        appartenance_ess: string;
    };
    coordonnees: {
        adresse_siege: {
            cplt_1: string;
            num_voie: number;
            voie: string;
            commune: string;
            code_insee: number;
            cp: number;
            type_voie: string;
        };
        adresse_gestion: {
            cplt_1: string;
            num_voie: number;
            voie: string;
            commune: string;
            code_insee: number;
            cp: number;
            type_voie: string;
        };
    };
    nbEtabsActifs: number;
    etablissement?: SirenStructureEtablissementDto[];
}
